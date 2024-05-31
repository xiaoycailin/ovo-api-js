export enum ResponseMessage {
    OK = "Request berhasil diproses.",
    BAD_REQUEST = "Permintaan tidak valid.",
    UNAUTHORIZED = "Otentikasi gagal.",
    FORBIDDEN = "Akses ditolak.",
    NOT_FOUND = "Sumber tidak ditemukan.",
    METHOD_NOT_ALLOWED = "Metode permintaan tidak diizinkan.",
    INTERNAL_SERVER_ERROR = "Kesalahan server internal."
}
