import React, { useState, useRef, useEffect, CSSProperties } from 'react';

interface AutoCompleteInputProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  inputStyle?: CSSProperties;
  listStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  itemHoverStyle?: CSSProperties;
  itemFocusedStyle?: CSSProperties;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  label,
  value,
  options,
  onChange,
  onSelect,
  inputStyle,
  listStyle,
  itemStyle,
  itemHoverStyle,
  itemFocusedStyle,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const stringMatch = (text: string, pattern: string): boolean => {
    if (!pattern) return true; 
    if (!text) return false;

    const n = text.length;
    const m = pattern.length;

    const lowerCaseText = text.toLowerCase();
    const lowerCasePattern = pattern.toLowerCase();

    if (m > n) return false;

    for (let j = 0; j < m; j++) {
      if (lowerCaseText[j] !== lowerCasePattern[j]) {
        return false; 
      }
    }
    return true; 
  };

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const newFilteredOptions = options.filter(option =>
      stringMatch(option, lowerCaseSearchTerm)
    );
    setFilteredOptions(newFilteredOptions);
    setFocusedIndex(-1);
  }, [searchTerm, options]);

  useEffect(() => {
    if (focusedIndex !== -1 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const handleOptionSelect = (selectedValue: string) => {
    setSearchTerm(selectedValue);
    onSelect(selectedValue);
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    setFilteredOptions(options); 
    setFocusedIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredOptions.length === 0 || !showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prevIndex =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : filteredOptions.length - 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex !== -1 && filteredOptions[focusedIndex]) {
        handleOptionSelect(filteredOptions[focusedIndex]);
      } else if (filteredOptions.length === 1 && searchTerm.toLowerCase() === filteredOptions[0].toLowerCase()){
        handleOptionSelect(filteredOptions[0]);
      } else {
        onSelect(searchTerm);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div style={{ position: 'relative', marginBottom: '10px' }}>
      <label htmlFor={label.toLowerCase()} style={{ marginBottom: '4px', display: 'block' }}>
        {label}:
      </label>
      <input
        id={label.toLowerCase()}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={inputStyle}
        autoComplete="off"
        ref={inputRef}
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <ul style={listStyle} ref={listRef}>
          {filteredOptions.map((item, index) => (
            <li
              key={item}
              style={{
                ...itemStyle,
                backgroundColor: hoveredItem === item
                  ? (itemHoverStyle?.backgroundColor || 'initial')
                  : focusedIndex === index
                    ? (itemFocusedStyle?.backgroundColor || 'initial')
                    : (itemStyle?.backgroundColor || 'initial'),
              }}
              onClick={() => handleOptionSelect(item)}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;

