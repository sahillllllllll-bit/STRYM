
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const colors = [ 'gray', 'black', 'white', 'blue', 'red', 'green', 'purple', 'orange'];
const textColors = [ 'gray', 'black', 'white', 'blue', 'red', 'green', 'purple', 'orange'];

const ThemeSelector = () => {
  const { themeColor, setThemeColor } = useContext(ThemeContext);
  

  return (
    <>
    <div  style={{ backgroundColor: 'var(--primary-color)' }} className=" h-full  flex justify-center mt-5 p-10 gap-2  rounded-full  mx-5  ">
        <h1 className='text-gray-400'>Background-Color</h1><br /><br />
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

      <div  style={{ backgroundColor: 'var(--primary-color)' }} className=" h-full  flex justify-center mt-5 p-10 gap-2  rounded-full  mx-5  ">
        <h1 className='text-gray-400'>Fonts-Color</h1><br /><br />
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
    </>

    
  );
};

export default ThemeSelector;
