import "regenerator-runtime/runtime";
import React from "react";
import { Button } from "@airtable/blocks/ui";
import { KeyPair } from "near-api-js";

export default function App({
    contract,
    currentUser,
    nearConfig,
    wallet,
    near
}) {
    const PENDING_ACCESS_KEY_PREFIX = "pending_key";

    async function getRequestSignInUrl(contractId, successUrl) {
        
        const currentUrl = new URL(window.location.href);
        const newUrl = new URL("https://wallet.testnet.near.org/login/");
        newUrl.searchParams.set(
          "success_url",
          successUrl || currentUrl.href
        );
        newUrl.searchParams.set("contract_id", contractId);
        const accessKey = await KeyPair.fromRandom("ed25519");
        newUrl.searchParams.set("public_key", accessKey.getPublicKey().toString());
        await near.config.keyStore.setKey(
          nearConfig.networkId,
          PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(),
          accessKey
        );
  
        return newUrl
    }
    async function requestSignIn() {
        ////hard code
        const currentUrl =
          "https://airtable.com/appNfo9pSP4UJ7KwD/tbl60Q6Z8z4nAZpED/viwtb6t9vJOebUp1X?blocks=bipAeAsXuACXlE8b3";

        const linkUrl = await getRequestSignInUrl(
          await contract.contractId,
          currentUrl
        );
        window.open(linkUrl.href,"_parent")
    }

    function SignIn() {
      return <Button onClick={requestSignIn}>SignIn</Button>;
    };
        const signOut = () => {
            wallet.signOut();
            window.location.replace(window.location.origin + window.location.pathname);
        };

        return (
            <>
                <div>
                    <br/>
                    {currentUser ? (
                        <Button onClick={signOut}>SignOut</Button>
                    ) : (
                        <SignIn/>
                    )}
                </div>
                {currentUser ? (
                    <p></p>
                ) : (
                    <p>Loading..</p>
                )}
            </>
        );
    }

