import moment from "moment";
import { parseStringPromise } from "xml2js";

export async function getNFE(uri: string): Promise<Receipt | undefined> {
  try {
    const response = await fetch(uri);

    const nfeXml = await response.text();

    const result = (await parseStringPromise(nfeXml, { trim: true })) as NFE;

    if (result.nfeProc.erro[0] === "") {
      const receipt = result.nfeProc.proc[0].nfeProc[0].NFe[0].infNFe[0];

      return {
        date: moment(receipt.ide[0].dhEmi[0]).format("MM/DD/YYYY HH:mm"),
        total: receipt.total[0].ICMSTot[0].vNF[0],
        url: uri,
        venue: receipt.emit[0].xFant ?? receipt.emit[0].xNome[0],
      };
    }

    console.error(`Error on url: ${uri}`);
  } catch (e) {
    console.error(`Error on url: ${uri}`);
  }
}
