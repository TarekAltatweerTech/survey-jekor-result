import { useEffect, useState } from 'react';

export default function ProductImage({ src, name, className = '' }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <div className={'product-plate ' + className}>
      <span className="product-plate__rim" aria-hidden="true" />
      {src && !failed ? (
        <img src={src} alt={name} onError={() => setFailed(true)} />
      ) : (
        <span className="product-plate__empty" aria-hidden="true">
          <span />
        </span>
      )}
    </div>
  );
}
