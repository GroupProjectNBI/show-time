import { Outlet } from 'react-router-dom';
import { useStateObject } from '../utils/useStateObject';

export default function Main() {
  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Price (low to high)',
    bwImages: false
  });

  return (
    <main className="pt-24">
      <div className="mx-auto w-[min(1200px,calc(100%-32px))] pb-10">
        <Outlet context={stateAndSetter} />
      </div>
    </main>
  );
}
