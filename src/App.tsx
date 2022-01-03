import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import { getNFE } from "./utils/nfe";
import "./App.css";

const scannedURL = new Set();

function App() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  useEffect(() => {
    async function onScanSuccess(decodedText: string) {
      if (scannedURL.has(decodedText)) {
        return;
      }
      scannedURL.add(decodedText);
      const uri = decodedText.replace(
        "http://nfce.sefaz.pe.gov.br",
        "https://192.168.68.128:3000"
      );

      const receipt = await getNFE(uri);

      if (!receipt) {
        return;
      }

      setReceipts((receipts) => {
        const receiptSet = new Set(receipts);
        receiptSet.add(receipt);
        return Array.from(receiptSet);
      });
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, undefined);
  }, []);

  return (
    <div className="App">
      <button
        onClick={() => {
          getNFE(
            "http://nfce.sefaz.pe.gov.br/nfce-web/consultarNFCe?p=26210108602360000175650010000588051556558443"
          );
        }}
      >
        Get NFe
      </button>
      <div id="reader"></div>
      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Venue</td>
            <td>Total</td>
            <td>URL</td>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr>
              <td>{receipt.date}</td>
              <td>{receipt.venue}</td>
              <td>{receipt.total}</td>
              <td>
                <a href={receipt.url} rel="noreferrer" target="_blank">
                  {receipt.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
