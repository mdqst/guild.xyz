"use client"

import { CheckMark } from "@/components/CheckMark"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { AvatarGroup } from "@/components/ui/AvatarGroup"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/Skeleton"
import { ContributionCard } from "../_components/ContributionCard"
import { EditContributions } from "../_components/EditContributions"
import { EditProfile } from "../_components/EditProfile"
import { OperatedGuildCard } from "../_components/OperatedGuildCard"
import { ProfileOwnerGuard } from "../_components/ProfileOwnerGuard"
import { RecentActivity } from "../_components/RecentActivity"
import { useContribution } from "../_hooks/useContribution"
import { useProfile } from "../_hooks/useProfile"
import { ProfileSkeleton } from "./ProfileSkeleton"

export const Profile = () => {
  const { data: profile } = useProfile()
  const { data: contributions } = useContribution()

  if (!profile || !contributions) return <ProfileSkeleton />

  return (
    <div className="mt-24">
      <div className="relative mb-24 flex flex-col items-center">
        <ProfileOwnerGuard>
          <EditProfile />
        </ProfileOwnerGuard>
        <div className="relative mb-12 flex items-center justify-center">
          <Avatar className="size-48">
            <AvatarImage
              src={profile.profileImageUrl ?? ""}
              alt="profile"
              width={192}
              height={192}
            />
            <AvatarFallback>
              <Skeleton className="size-full" />
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="break-all text-center font-bold text-4xl leading-tight tracking-tight">
          {profile.name}
          <CheckMark className="ml-2 inline size-6 fill-yellow-500" />
        </h1>
        <div className="text-lg text-muted-foreground">@{profile.username}</div>
        <p className="mt-6 max-w-md text-pretty text-center text-lg text-muted-foreground">
          {profile.bio}
        </p>
        <div className="mt-8 grid grid-cols-[repeat(3,auto)] gap-x-8 gap-y-6 sm:grid-cols-[repeat(5,auto)]">
          <div className="flex flex-col items-center leading-tight">
            <div className="font-bold text-lg">3232</div>
            <div className="text-muted-foreground">Guildmates</div>
          </div>
          <Separator orientation="vertical" className="h-12" />
          <div className="flex flex-col items-center leading-tight">
            <div className="font-bold text-lg">0</div>
            <div className="text-muted-foreground">Followers</div>
          </div>
          <Separator orientation="vertical" className="hidden h-12 sm:block" />
          <div className="col-span-3 flex items-center gap-2 place-self-center sm:col-span-1">
            <AvatarGroup imageUrls={["", ""]} count={8} />
            <div className="text-muted-foreground leading-tight">
              Followed by <span className="font-bold">Hoho</span>,<br />
              <span className="font-bold">Hihi</span> and 22 others
            </div>
          </div>
        </div>
      </div>
      <h2 className="mb-3 font-bold text-lg">Operated guilds</h2>
      <OperatedGuildCard />
      <div className="mt-8 mb-3 flex items-center justify-between">
        <h2 className="font-bold text-lg">Top contributions</h2>
        <ProfileOwnerGuard>
          <EditContributions />
        </ProfileOwnerGuard>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {contributions.map((contribution) => (
          <ContributionCard contribution={contribution} key={contribution.id} />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-3 font-bold text-lg">Recent activity</h2>
        <RecentActivity />
        <p className="mt-2 font-semibold text-muted-foreground">
          &hellip; only last 20 actions are shown
        </p>
      </div>
    </div>
  )
}