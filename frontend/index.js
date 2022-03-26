import { initializeBlock } from "@airtable/blocks/ui";
import {
  useBase,
  useRecords,
  RecordCard,
  updateRecordAsync,
} from "@airtable/blocks/ui";
import React, { useEffect, useState, useMemo } from "react";
import * as nearAPI from "near-api-js";
import getConfig from "./config.js";
const { utils, providers, keyStores, KeyPair } = nearAPI


function HelloWorldApp() {
  const base = useBase();
  const table = base.tables[0];
  const rec = useRecords(table);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();
  const [progress, setProgress] = useState(0);

  const fetchData = async (record) => {
    const nearConfig = getConfig("testnet");
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const near = await nearAPI.connect({ keyStore, ...nearConfig });
  const walletConnection = new nearAPI.WalletConnection(near);
let currentUser;

if (walletConnection.getAccountId()) {
  currentUser = {
    accountId: walletConnection.getAccountId(),
    balance: (await walletConnection.account().state()).amount,
  };
}
    const account_id = nearConfig.contractName;
    const contract = await new nearAPI.Contract(
      account,
      nearConfig.contractName,
      {
        viewMethods: ["getAllNFTsByOwner"],
      }
    );
    const response = await fetch("https://rpc.testnet.near.org", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "query",
        params: {
          request_type: "view_account",
          finality: "final",
          account_id: record.name,
        },
      }),
    });
    return response.json();
  };

  const additional_data = useMemo(
    () =>
      rec.map((item, index) =>
        fetchData(item).then((res) => {
          setProgress((val) => val + 1);
          return res;
          // console.log(Math.round(res.result.amount));
        })
      ),
    [setProgress]
  );

  useEffect(() => {
    setIsLoading(true);
    console.log(additional_data);
    Promise.all(additional_data).then((data) => {
      console.log(data);
      setResult(data);
      setIsLoading(false);
    });
  }, [setIsLoading, setResult, additional_data]);

  if (isLoading || !result) {
    return (
      <div className="App">
        Loading Data {progress} out of {rec.length}
      </div>
    );
  } else
    return result.map((item, index) => {
      if (item.result) {
        table.updateRecordAsync(rec[index], {
          // Change these names to fields in your base
          "Amount (Near)": Number(item.result.amount / 1e24).toFixed(2),
        });

        return (
          <p>
            {index + 1}) {rec[index].name} has balance:{" "}
            {Number(item.result.amount / 1e24).toFixed(2)}Ⓝ
          </p>
        );
      } else {
        return <p>NaN</p>;
      }
    });
}

initializeBlock(() => <HelloWorldApp />);
