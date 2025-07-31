export const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    // Jika lebih dari 7 hari, return null untuk menggunakan format tanggal normal
    if (diffInDays > 7) {
        return null;
    }

    if (diffInSeconds < 60) {
        return "Baru saja";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} jam yang lalu`;
    } else {
        return `${diffInDays} hari yang lalu`;
    }
}

export const getUnreadCount = (notifikasi) => {
    const unreadRiwayat = notifikasi.riwayatBaru?.filter(item => item.is_read === 0) || [];
    const unreadJadwal = notifikasi.jadwalBaru?.filter(item => item.is_read === 0) || [];
    return unreadRiwayat.length + unreadJadwal.length;
}
