"use client";

import {
  Download,
  Home,
  Lightbulb,
  RadioTower,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import GitHub from "@/components/icons/git-hub";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { useUserQuery } from "@/hooks/use-user-query";

const features = [
  {
    title: "홈",
    url: "/",
    icon: Home,
  },
];

const docs = [
  {
    title: "배경 / 원칙",
    url: "/background",
    icon: RadioTower,
  },
  {
    title: "쉬운 번역팁",
    url: "/tips",
    icon: Lightbulb,
  },
  {
    title: "제작 이야기",
    url: "/colophon",
    icon: Rocket,
  },
];

const adminItems = [
  {
    title: "하이라이트 관리",
    url: "/admin/highlights",
    icon: Sparkles,
  },
];

export function SideBar() {
  const { setOpenMobile } = useSidebar();
  const { data: user } = useUserQuery();
  const isAdmin = user?.app_metadata?.userrole === "admin";
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>바로가기</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {features.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>알아보기</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docs.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>관리자</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    {/* Plain <a> so the browser downloads the CSV instead of
                        client-side navigating (and Link would prefetch it) */}
                    <a
                      href="/admin/export/jargons"
                      download
                      onClick={() => setOpenMobile(false)}
                    >
                      <Download />
                      <span>용어 CSV 다운로드</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="https://github.com/Zeta611/easyword"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                onClick={() => setOpenMobile(false)}
              >
                <GitHub className="size-4" />
                <span>깃헙 저장소</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
