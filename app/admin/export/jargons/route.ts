import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { QUERIES } from "@/lib/supabase/repository";

const PAGE_SIZE = 1000;

function csvField(value: string | number | null | undefined): string {
  let s = value == null ? "" : String(value);
  // Neutralize spreadsheet formula injection in community-submitted names
  if (/^[=+\-@]/.test(s)) {
    s = `'${s}`;
  }
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.userrole !== "admin") {
    return new NextResponse("관리자 권한이 필요해요", { status: 403 });
  }

  type JargonRow = NonNullable<
    Awaited<ReturnType<typeof QUERIES.listJargonsForExport>>["data"]
  >[number];

  const jargons: JargonRow[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await QUERIES.listJargonsForExport(
      supabase,
      offset,
      PAGE_SIZE,
    );
    if (error) {
      return new NextResponse("내보내기 중 문제가 생겼어요", { status: 500 });
    }
    jargons.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }

  const rows = ["jargon,slug,categories,translation,llm_rank"];
  for (const jargon of jargons) {
    const categories = jargon.categories
      .map(({ category }) => category.acronym)
      .sort()
      .join("; ");
    const translations = [...jargon.translations].sort(
      (a, b) =>
        (a.llm_rank ?? Infinity) - (b.llm_rank ?? Infinity) ||
        a.name.localeCompare(b.name),
    );
    const prefix = [csvField(jargon.name), csvField(jargon.slug)];
    if (translations.length === 0) {
      rows.push([...prefix, csvField(categories), "", ""].join(","));
    } else {
      for (const translation of translations) {
        rows.push(
          [
            ...prefix,
            csvField(categories),
            csvField(translation.name),
            csvField(translation.llm_rank),
          ].join(","),
        );
      }
    }
  }
  const csv = rows.join("\r\n") + "\r\n";

  const today = new Date().toISOString().slice(0, 10);
  // UTF-8 BOM so Excel decodes Korean text correctly
  const bom = String.fromCharCode(0xfeff);
  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="easyword-jargons-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
