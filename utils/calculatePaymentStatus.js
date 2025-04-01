// Helper function to determine payment status
function calculatePaymentStatus(totalCost, paidAmount) {
    if (paidAmount >= totalCost) return "paid";
    if (paidAmount === 0) return "due";
    return "partial";
}

module.exports = calculatePaymentStatus