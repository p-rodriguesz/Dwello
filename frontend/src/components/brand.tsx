export function Brand({ inverse = false }: { inverse?: boolean }) { return <div className={`brand ${inverse ? 'brand-inverse' : ''}`}><span className="brand-mark">⌂</span><span>Dwello</span></div>; }
