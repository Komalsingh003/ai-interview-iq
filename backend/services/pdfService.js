import PDFDocument from "pdfkit";

export function streamReportPdf(res, report) {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=interview-strategy.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("AI Interview Strategy Report", { underline: true });
  doc.moveDown();

  doc.fontSize(14).text(`Match Score: ${report.matchScore}/100`);
  doc.moveDown();

  doc.fontSize(16).text("Skill Gaps");
  report.skillGaps.forEach((s) => doc.fontSize(11).text(`• ${s}`));
  doc.moveDown();

  doc.fontSize(16).text("Technical Questions");
  report.technicalQuestions.forEach((q) => doc.fontSize(11).text(`• ${q}`));
  doc.moveDown();

  doc.fontSize(16).text("Behavioral Questions");
  report.behavioralQuestions.forEach((q) => doc.fontSize(11).text(`• ${q}`));
  doc.moveDown();

  doc.fontSize(16).text("7-Day Roadmap");
  report.roadmap.forEach((r) => {
    doc.fontSize(12).text(`Day ${r.day}: ${r.focus}`);
    r.tasks.forEach((t) => doc.fontSize(10).text(`   - ${t}`));
  });
  doc.moveDown();

  doc.fontSize(16).text("Resume Suggestions");
  report.resumeSuggestions.forEach((s) => doc.fontSize(11).text(`• ${s}`));

  doc.end();
}
