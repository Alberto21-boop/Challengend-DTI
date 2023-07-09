import money from '../../assets/Lottie/money.json';
import Lottie from 'react-lottie';

export const Money = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: money
  }

  return <Lottie options={defaultOptions} width={500} height={450} />
}