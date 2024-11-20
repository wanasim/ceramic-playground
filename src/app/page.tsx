"use client";

import { DIDSession } from "did-session";
import {
  EthereumWebAuth,
  getAccountId,
} from "@didtools/pkh-ethereum";
import { useState } from "react";
import {
  createWalletClient,
  custom,
  EIP1193Provider,
} from "viem";
import { sepolia } from "viem/chains";
import styles from "./styles/Home.module.css";
import { ComposeClient } from "@composedb/client";
declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

// const CERAMIC_URL = process.env.URL ?? "http://localhost:7007";

// /**
//  * Configure ceramic Client & create context.
//  */
// const ceramic = new CeramicClient(CERAMIC_URL);

// export const compose = new ComposeClient({
//   ceramic,
//   definition: definition as RuntimeCompositeDefinition,
// });
export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [session, setSession] = useState();
  // const web3ModalRef = useRef();
  const client = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  });

  const getEthAuthProvider = async () => {
    console.log("client", client);
    const [addresses] = await client.requestAddresses();
    console.log("ADDRESSes", addresses);
    const accountId = await getAccountId(
      client,
      addresses[0]
    );
    const authMethod = await EthereumWebAuth.getAuthMethod(
      client,
      accountId
    );

    const compose = new ComposeClient();

    const session = await DIDSession.get(
      accountId,
      authMethod,
      { resources: compose.resources }
    );
    compose.setDID(session.did);

    return session;
  };

  // const getProvider = async () => {
  //   // const provider = await web3ModalRef.current.connect();
  //   // const wrappedProvider = new Web3Provider(provider);
  //   return wrappedProvider;
  // };
  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <span className={styles.title}>Ceramic Demo</span>
        {/* {connection.status === "connected" ? (
          <span className={styles.subtitle}>Connected</span>
        ) : ( */}
        <button
          onClick={getEthAuthProvider}
          className={styles.button}
          // disabled={connection.status === "connecting"}
        >
          Connect
        </button>
        {/* )} */}
      </div>

      <div className={styles.content}>
        <div className={styles.connection}>
          {/* {connection.status === "connected" ? (
            <div>
              <span className={styles.subtitle}>
                Your 3ID is {connection.selfID.id}
              </span>
              <RecordSetter />
            </div>
          ) : ( */}
          <span className={styles.subtitle}>
            Connect with your wallet to access your 3ID
          </span>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
