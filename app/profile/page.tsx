import { redirect } from "next/navigation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/server";
import { QUERIES } from "@/lib/supabase/repository";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DisplayNameForm from "@/components/profile/display-name-form";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/auth/login");

  const { data: profile } = await QUERIES.getNameAndPhoto(supabase, user.id);

  const initials = (profile?.display_name || (user.email ?? ""))
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            {profile?.photo_url ? (
              <AvatarImage
                src={profile.photo_url}
                alt={profile?.display_name ?? ""}
              />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <DisplayNameForm
              userId={user.id}
              initialName={profile?.display_name ?? ""}
            />
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-end text-sm">
            함께한 지{" "}
            {profile?.created_at ? dayjs(profile.created_at).fromNow(true) : ""}{" "}
            되었어요
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
