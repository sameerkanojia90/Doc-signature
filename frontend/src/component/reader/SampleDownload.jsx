import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import "../../App.css";

function SampleDownload() {
  const generateDoc = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun("Invoice Template")],
            }),
            new Paragraph("Date: {Date}"),
            new Paragraph("Customer: {Customer Name}"),
            new Paragraph("Amount: ${Amount}"),
            new Paragraph("Due Date: {Due Date}"),
            new Paragraph("Address: {Address}"),
            new Paragraph("Court: {Court}"),
            new Paragraph("CaseId: {Caseid}"),
            new Paragraph("Reference Number: {Reference Number}"),
            new Paragraph(""),
            new Paragraph("{Signature}"),
            new Paragraph("{DelegationMessage}"),
            new Paragraph("{QR Code}"),
            new Paragraph("Signature"),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "sample-template.docx");
  };

  return (
    <p className="sample-text">
      Need a sample?{" "}
      <button onClick={generateDoc} className="sample-download-btn">
        Download here
      </button>
    </p>
  );
}

export default SampleDownload;
