import { MAX_ORDER_PIECES, SHIPPING_PHP_BY_PIECE_COUNT } from '@/config/constants';

/** Total garment pieces across all cart lines. */
export function totalPiecesFromLineItems(items: { quantity: number }[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}

/** Shipping (PHP) from total piece count — same for COD and online. Keep in sync with `create-order`. */
export function shippingFeeByTotalPiecesPhp(totalPieces: number): number {
  if (totalPieces <= 0) return 0;
  const n = Math.min(totalPieces, MAX_ORDER_PIECES);
  return SHIPPING_PHP_BY_PIECE_COUNT[n] ?? 0;
}

export function isOrderPieceCountWithinLimit(totalPieces: number): boolean {
  return totalPieces >= 1 && totalPieces <= MAX_ORDER_PIECES;
}
