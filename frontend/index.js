import {initializeBlock} from '@airtable/blocks/ui';
import {useBase, useRecords, RecordCard} from '@airtable/blocks/ui';
import React, { useEffect,useState, useMemo } from 'react';
  
    function HelloWorldApp() {
    const base = useBase();
    const table = base.tables[0]
    const rec = useRecords(table)

    const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();
  const [progress, setProgress] = useState(0);

  const fetchData = async (record)=> {
  const response = await fetch("https://rpc.testnet.near.org", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": "dontcare",
          "method": "query",
          "params": {
            "request_type": "view_account",
            "finality": "final",
            "account_id": record.name
          }
        })
      })
      return response.json()
  }

  const additional_data = useMemo(() => rec.map((item, index) => fetchData(item).then((res) => {
    setProgress(val => val + 1)
    return res
    // console.log(Math.round(res.result.amount));
  })), [setProgress]);

  useEffect(() => {
    setIsLoading(true)
    console.log(additional_data);
    Promise.all(additional_data).then((data) => {
        console.log(data);
      setResult(data);
      setIsLoading(false);
    });
  }, [setIsLoading, setResult, additional_data]) 

  if (isLoading || !result) {
    return (
      <div className="App">
        Loading Data {progress} out of {rec.length}
      </div>
    );
  }
  else return ( 
      result.map((item, index)=>item.result ?
      <p>{index+1}) {rec[index].name} has balance: {Number(item.result.amount/1e24).toFixed(2)}Ⓝ</p>
      :<p>NaN</p>))
      }
  

  
        
  


initializeBlock(() => <HelloWorldApp />);
