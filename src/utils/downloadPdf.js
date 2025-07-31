// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';


// const handleDownloadPDF = async (elementId = 'report-content', filename = 'laporan.pdf') => {
//     const element = document.getElementById(elementId);
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//         scale: 2,
//         scrollY: -window.scrollY,
//     });

//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     const imgProps = pdf.getImageProperties(imgData);
//     const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
//     heightLeft -= pdfHeight;

//     // ✅ Tambahkan threshold supaya halaman baru hanya dibuat jika heightLeft cukup besar
//     const threshold = 10; // dalam mm

//     while (heightLeft > threshold) {
//         position -= pdfHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
//         heightLeft -= pdfHeight;
//     }


//     pdf.save(filename);
// };

// export default handleDownloadPDF;


import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const handleDownloadPDF = async (elementId = 'report-content', filename = 'laporan.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // 💡 Cari posisi elemen page-break
    const pageBreakEl = element.querySelector('.page-break');
    let forcePageBreak = false;

    if (pageBreakEl) {
        const containerTop = element.getBoundingClientRect().top;
        const breakTop = pageBreakEl.getBoundingClientRect().top;
        const relativeTop = breakTop - containerTop;

        // A4 height is about 1122px at scale: 2 (html2canvas)
        // Jika jarak terlalu dekat ke bawah (misal 800px), paksa pindah halaman
        if (relativeTop > 800) {
            forcePageBreak = true;
            pageBreakEl.style.marginTop = '1000px';
        }
    }

    const canvas = await html2canvas(element, {
        scale: 2,
        scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 10) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
    }

    pdf.save(filename);

    // Reset perubahan DOM
    if (pageBreakEl && forcePageBreak) {
        pageBreakEl.style.marginTop = '';
    }
};

export default handleDownloadPDF;
