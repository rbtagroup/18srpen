document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calcForm");
  const output = document.getElementById("output");
  const resetBtn = document.getElementById("resetBtn");
  const pdfBtn = document.getElementById("pdfExport");
  const themeToggle = document.getElementById("themeToggle");
  const historyBox = document.getElementById("history");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const driver = getValue("driverName");
    const shift = getValue("shiftType");
    const km = getNumber("km");
    const trzba = getNumber("trzba");
    const pristavne = getNumber("pristavne");
    const palivo = getNumber("palivo");
    const myti = getNumber("myti");
    const kartou = getNumber("kartou");
    const fakturou = getNumber("fakturou");
    const jine = getNumber("jine");

    const netto = trzba - pristavne;
    const minTrzba = km * 15;
    const nedoplatek = trzba < minTrzba;

    let vyplata = 0;
    if (netto > 3330) {
      vyplata = netto * 0.3;
    } else {
      vyplata = shift === "pul" ? 500 : 1000;
    }

    const datum = new Date().toLocaleDateString("cs-CZ");

    const html = `
      <div class="box">
        <strong>Datum:</strong> ${datum}<br />
        <strong>Řidič:</strong> ${driver}<br />
        <strong>Směna:</strong> ${shift}<br />
        <strong>Kilometry:</strong> ${km} km<br />
        <strong>Tržba:</strong> ${trzba} Kč<br />
        <strong>Přístavné:</strong> ${pristavne} Kč<br />
        <strong>Netto tržba:</strong> ${netto} Kč<br />
        <strong>Výplata:</strong> ${vyplata.toFixed(2)} Kč<br />
        <strong>Palivo:</strong> ${palivo} Kč<br />
        <strong>Mytí:</strong> ${myti} Kč<br />
        <strong>Kartou:</strong> ${kartou} Kč<br />
        <strong>Fakturou:</strong> ${fakturou} Kč<br />
        <strong>Jiné:</strong> ${jine} Kč<br />
        ${nedoplatek ? '<div class="error">⚠️ Tržba je nižší než minimální požadavek!</div>' : ''}
      </div>
    `;

    output.innerHTML = html;
    output.classList.remove("hidden");

    // Přidání do historie
    historyBox.innerHTML += html;
    historyBox.classList.remove("hidden");
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    output.classList.add("hidden");
    output.innerHTML = "";
  });

  pdfBtn.addEventListener("click", () => {
    html2canvas(output).then(canvas => {
      const img = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, width, height);
      pdf.save("vypocet.pdf");
    });
  });

  function getValue(id) {
    return document.getElementById(id).value.trim();
  }

  function getNumber(id) {
    return parseFloat(document.getElementById(id).value) || 0;
  }
});