import React, { useState } from 'react';
import { Calculator, Hash } from 'lucide-react';

const NumberConverter = () => {
  const [inputNumber, setInputNumber] = useState('');
  const [convertedFormats, setConvertedFormats] = useState(null);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const convertToWords = (num) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const convertGroup = (n) => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result.trim();
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result.trim();
    };

    if (num === 0) return 'zero';

    let result = '';
    let scale = ['', 'thousand', 'million', 'billion', 'trillion'];
    let scaleIndex = 0;

    while (num > 0) {
      let group = num % 1000;
      if (group !== 0) {
        let groupWords = convertGroup(group);
        result = groupWords + (scale[scaleIndex] ? ' ' + scale[scaleIndex] : '') + (result ? ' ' + result : '');
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result.trim();
  };

  const convertToIndianFormat = (num) => {
    if (num < 100000) {
      return convertToWords(num);
    }

    let result = '';
    let remaining = num;

    // Crores
    if (remaining >= 10000000) {
      const crores = Math.floor(remaining / 10000000);
      result += convertToWords(crores) + ' crore ';
      remaining %= 10000000;
    }

    // Lakhs
    if (remaining >= 100000) {
      const lakhs = Math.floor(remaining / 100000);
      result += convertToWords(lakhs) + ' lakh ';
      remaining %= 100000;
    }

    // Thousands
    if (remaining >= 1000) {
      const thousands = Math.floor(remaining / 1000);
      result += convertToWords(thousands) + ' thousand ';
      remaining %= 1000;
    }

    // Remaining
    if (remaining > 0) {
      result += convertToWords(remaining);
    }

    return result.trim();
  };

  const parseTextToNumber = (input) => {
    const text = input.toLowerCase().trim();

    // First check if it contains any text units
    const hasTextUnit = /[a-z]/i.test(text);

    if (!hasTextUnit) {
      // Pure number - remove commas and parse
      const directNumber = parseInt(text.replace(/,/g, ''));
      return isNaN(directNumber) ? NaN : directNumber;
    }

    // Extract number and unit - more flexible regex
    const match = text.match(/^(\d+(?:\.\d+)?)\s*([a-z]+)$/i);
    if (!match) {
      return NaN;
    }

    const [, numberPart, unit] = match;
    const baseNumber = parseFloat(numberPart);

    if (isNaN(baseNumber)) {
      return NaN;
    }

    const multipliers = {
      'thousand': 1000,
      'k': 1000,
      'lakh': 100000,
      'lakhs': 100000,
      'million': 1000000,
      'crore': 10000000,
      'crores': 10000000,
      'billion': 1000000000,
      'trillion': 1000000000000
    };

    const multiplier = multipliers[unit.toLowerCase()];
    return multiplier ? Math.floor(baseNumber * multiplier) : NaN;
  };

  const handleConvert = () => {
    const num = parseTextToNumber(inputNumber);

    if (isNaN(num) || num < 0) {
      alert('Please enter a valid number (e.g., 1000000, 15 lakhs, 40 million)');
      return;
    }

    const formats = {
      original: formatNumber(num),
      words: convertToWords(num),
      indian: convertToIndianFormat(num),
      lakhs: num >= 100000 ? `${(num / 100000).toFixed(2)} lakhs` : '< 1 lakh',
      crores: num >= 10000000 ? `${(num / 10000000).toFixed(2)} crores` : '< 1 crore',
      millions: num >= 1000000 ? `${(num / 1000000).toFixed(2)} million` : '< 1 million',
      billions: num >= 1000000000 ? `${(num / 1000000000).toFixed(2)} billion` : '< 1 billion'
    };

    setConvertedFormats(formats);
  };

  const handleInputChange = (e) => {
    // Allow numbers, commas, spaces, and letters for text input
    const value = e.target.value.replace(/[^0-9,.\s a-zA-Z]/g, '');
    setInputNumber(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="text-indigo-600 mr-2" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Number Converter</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter a number or text format
              </label>
              <input
                type="text"
                value={inputNumber}
                onChange={handleInputChange}
                placeholder="e.g., 1,000,000 or 15 lakhs or 40 million"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
              />
            </div>

            <button
              onClick={handleConvert}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Hash className="mr-2" size={20} />
              Convert
            </button>
          </div>
        </div>

        {convertedFormats && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Converted Formats</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-1">Number</h3>
                <p className="text-lg text-indigo-600 font-mono">{convertedFormats.original}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-1">In Words</h3>
                <p className="text-green-700 capitalize">{convertedFormats.words}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-1">Indian Format</h3>
                <p className="text-orange-700 capitalize">{convertedFormats.indian}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">Lakhs</h4>
                  <p className="text-blue-700 text-sm">{convertedFormats.lakhs}</p>
                </div>

                <div className="bg-purple-50 p-3 rounded-xl">
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">Crores</h4>
                  <p className="text-purple-700 text-sm">{convertedFormats.crores}</p>
                </div>

                <div className="bg-pink-50 p-3 rounded-xl">
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">Million</h4>
                  <p className="text-pink-700 text-sm">{convertedFormats.millions}</p>
                </div>

                <div className="bg-teal-50 p-3 rounded-xl">
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">Billion</h4>
                  <p className="text-teal-700 text-sm">{convertedFormats.billions}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberConverter;
