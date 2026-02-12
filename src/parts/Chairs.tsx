// import { useStateContext } from '../utils/useStateObject';
import { LiaChairSolid } from "react-icons/lia";

interface ChairsProps {
    numberOfSeats: number;
}

// an image component that automatically switches to black and white
// by adding the css class 'bw' if bwImages is true in our context
export default function Chairs({ numberOfSeats }: ChairsProps) {
    const seats = [...Array(numberOfSeats)];
    return (
        <div className="chairs-row" style={{ display: 'flex', gap: '5px' }}>
            {seats.map((_, i) => (
                <span key={i} className="seat-icon">
                    <LiaChairSolid />
                </span>
            ))}
            <span>({numberOfSeats} platser)</span>
        </div>
    );
}