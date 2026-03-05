import { getAssetUrl } from '../utils/utils';

// Denna komponent tar emot allt en vanlig <Image> tar emot, men fixar URL:en i smyg!
export default function Image({ src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <Image src={src ? getAssetUrl(src) : undefined} {...props} />;
}