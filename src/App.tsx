import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [receipts, setReceipts] = useState<string[]>([]);
  useEffect(() => {
    function onScanSuccess(decodedText: string) {
      setReceipts((receipts) => {
        const receiptSet = new Set(receipts);
        receiptSet.add(decodedText);
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
      <div id="reader"></div>
      <div>
        {receipts.map((link) => (
          <>
            <a href={link} rel="noreferrer" target="_blank">
              {link}
            </a>
            <br />
          </>
        ))}
      </div>
    </div>
  );
}

export default App;
