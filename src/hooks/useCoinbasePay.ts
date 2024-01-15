import { CBPayInstance, InitOnRampParams, initOnRamp } from "@coinbase/cbpay-js"
import { CHAIN_CONFIG, Chain, Chains } from "chains"
import useUser from "components/[guild]/hooks/useUser"
import { useRef, useState } from "react"
import { useChainId } from "wagmi"
import useToast from "./useToast"

const hideOverflow = () => {
  try {
    document.querySelector("body").style.overflow = "hidden"
  } catch {}
}

const showOverflow = () => {
  try {
    document.querySelector("body").style.overflow = ""
  } catch {}
}

const blockchains = Object.values(CHAIN_CONFIG)
  .map(({ coinbasePayName }) => coinbasePayName)
  .filter(Boolean)

// TODO: Wrap in a useSubmit, instead of using additional useState-s here
const useCoinbasePay = () => {
  const { id } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const onrampInstance = useRef<CBPayInstance>()
  const chainId = useChainId()

  const defaultNetwork =
    CHAIN_CONFIG[Chains[chainId] as Chain]?.coinbasePayName ??
    CHAIN_CONFIG.ETHEREUM.coinbasePayName

  const toast = useToast()

  const onDone = () => {
    setIsLoading(false)
    showOverflow()
  }

  const onOpen = (destinationWalletAddress: string) => {
    setIsLoading(true)
    setError(undefined)

    const options: InitOnRampParams = {
      appId: process.env.NEXT_PUBLIC_COINBASE_PAY_APPID,
      target: "#cbpay-container",
      widgetParameters: {
        partnerUserId: `${id}`,
        defaultNetwork,
        destinationWallets: [
          {
            address: destinationWalletAddress,
            blockchains,
          },
        ],
      },
      onSuccess: () => {
        onDone()
        toast({
          status: "success",
          title: "Coinbase Pay",
          description: "Wallet successfully topped up",
        })
      },
      onExit: (err) => {
        onDone()
        if (err) {
          setError(err)
          toast({
            status: "error",
            title: "Coinbase Pay",
            description: "Failed to top up wallet",
          })
          console.error(err)
        } else {
          toast({
            status: "warning",
            title: "Coinbase Pay",
            description: "Operation cancelled",
          })
        }
      },
      onEvent: (event) => {
        console.log("CB PAY EVENT", event)

        // if (event.eventName === "exit") {
        //   onrampInstance.current.destroy()
        // }
      },
      closeOnExit: true,
      closeOnSuccess: true,
      experienceLoggedIn: "embedded",
      experienceLoggedOut: "embedded",
      debug: true,
    }

    if (onrampInstance.current) {
      onrampInstance.current.destroy()
    }

    initOnRamp(options, (e?: Error, instance?: CBPayInstance) => {
      if (instance) {
        onrampInstance.current = instance

        onrampInstance.current.open()

        try {
          hideOverflow()
          // document.getElementById(CB_PAY_IFRAME_ID).style.zIndex = "99999"
        } catch {}
      } else if (e) {
        onDone()
        setError(e)
        console.error(e)
      }
    })
  }

  return { isLoading, onOpen, error }
}

export default useCoinbasePay