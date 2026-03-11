import logoFull from '../../assets/logo/logo-full.svg'
import logoSymbol from '../../assets/logo/logo-symbol.svg'

/**
 * Componente de logo oficial da OrçaFast.
 *
 * @param {'full' | 'symbol'} variant
 *   'full'   → logo completo com símbolo + texto (padrão) — uso em páginas de autenticação, landing, onboarding
 *   'symbol' → apenas o símbolo/ícone quadrado            — uso em favicon e locais compactos
 *
 * @param {string | number} height   Altura do logo. Default: '40px' (full) ou '32px' (symbol)
 * @param {string}          className Classes CSS adicionais
 * @param {object}          style     Estilos inline adicionais
 */
const OrcafastLogo = ({
    variant = 'full',
    height,
    className = '',
    style = {},
    ...rest
}) => {
    const isSymbol = variant === 'symbol'
    const defaultHeight = isSymbol ? '32px' : '40px'
    const resolvedHeight = height ?? defaultHeight

    return (
        <img
            src={isSymbol ? logoSymbol : logoFull}
            alt="OrçaFast"
            height={resolvedHeight}
            style={{
                height: resolvedHeight,
                width: 'auto',
                display: 'block',
                flexShrink: 0,
                ...style,
            }}
            className={className}
            draggable={false}
            {...rest}
        />
    )
}

export default OrcafastLogo
