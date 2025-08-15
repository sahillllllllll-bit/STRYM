
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const colors = [ 'gray', 'black', 'white', 'blue', 'red', 'green', 'purple', 'orange'];
const textColors = [ 'gray', 'black', 'white', 'blue', 'red', 'green', 'purple', 'orange'];

const ThemeSelector = () => {
  const { themeColor, setThemeColor } = useContext(ThemeContext);
  

  return (
    
    <div  style={{ backgroundColor: 'var(--primary-color)' }} className=" h-full  flex justify-center  gap-2 space-y-50  mx-5 ">
        <h1 className='text-white'>Background-Color</h1>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setThemeColor(color)}
          className={`w-8  h-8 rounded-full border-2 space-x-5 border-gray-300 ${
            themeColor === color ? 'ring-2 ring-black' : ''
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
      
     
    </div>

    
  );
};

export default ThemeSelector;
