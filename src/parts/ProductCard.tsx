import type Product from '../interfaces/Product';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ id, name, quantity, price$, slug }: Product) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      onClick={() => navigate('/products/' + slug)}
      className="mb-4 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/20"
    >
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[1fr_180px] sm:items-stretch">
        {/* LEFT */}
        <div>
          <h3 className="text-lg font-semibold text-accent">{name}</h3>

          <div className="mt-3 space-y-1 text-sm text-accent/80">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-accent/70 sm:hidden">Qty:</span>
              <span className="hidden font-semibold text-accent/70 sm:inline">Quantity:</span>
              <span className="font-semibold text-accent">{quantity}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-accent/70">Price:</span>
              <span className="font-semibold text-accent">
                ${price$.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/products/' + slug);
            }}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-accent transition hover:opacity-90"
          >
            More info
          </button>
        </div>

        {/* RIGHT */}
        <div className="h-40 overflow-hidden rounded-xl bg-black/20 sm:h-full">
          <img
            src={'/images/products/' + id + '.jpg'}
            alt={'Product image of the product ' + name + '.'}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
