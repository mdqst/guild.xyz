import { useConfetti } from "@/components/Confetti"
import { useToast } from "@/components/ui/hooks/useToast"
import { profileSchema } from "@/lib/validations/profileSchema"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/navigation"
import fetcher from "utils/fetcher"
import { z } from "zod"

export const useCreateProfile = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { confettiPlayer } = useConfetti()

  const createProfile = async (signedValidation: SignedValidation) =>
    fetcher(`/v2/profiles`, {
      method: "POST",
      ...signedValidation,
    })

  const submitWithSign = useSubmitWithSign<unknown>(createProfile, {
    onSuccess: (response) => {
      toast({
        variant: "success",
        title: "Successfully created profile",
      })
      confettiPlayer.current("Confetti from left and right")
      // @ts-ignore: TODO: either acquire types from backend, or type them here
      router.replace(`/profile/${response.username}`)
    },
    onError: (response) => {
      toast({
        variant: "error",
        title: "Failed to create profile",
        description: response.error,
      })
    },
  })
  return {
    ...submitWithSign,
    onSubmit: (payload: z.infer<typeof profileSchema>) =>
      submitWithSign.onSubmit(payload),
  }
}