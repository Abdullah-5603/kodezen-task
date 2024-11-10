import React, { useState } from 'react';
// import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import  arrayMove  from 'array-move';
import './ColorTabComponent.css';
import colorPalleteIcons from '../../assets/Icons/pallete.png'
import plusIcons from '../../assets/Icons/plus.png'
import ColorDrawer from '../ColorDrawer/ColorDrawer';

const initialColors = [
    { id: 1, title: 'Primary', color: '#FF0000' },
    { id: 2, title: 'Secondary', color: '#00FF00' },
    { id: 3, title: 'Title Text', color: '#0000FF' },
    { id: 4, title: 'Supporting Text', color: '#FFFF00' }, // New color added
];



const ColorTabComponent = () => {
    const [colors, setColors] = useState(initialColors);
    const [isColorDrawer, setIsColorDrawer] = useState(false)
    const [openDrawerId, setOpenDrawerId] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState({});
    const [hexColor, setHexColor] = useState('');

    // Handle hex color change
    const handleHexChange = (e) => {
      const value = e.target.value;
      if (value.match(/^#([0-9A-F]{3}){1,2}$/i) || value === '') {
        setHexColor(value);
      }
    };


    // Handle Drag Start
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('dragIndex', index);
    };

    const handleSaveChange = () => {
        // Find the matched color based on the openDrawerId
        const matchedColor = colors.find(color => color.id === openDrawerId);
    
        if (matchedColor && hexColor) {
            // Update the color value of the matched color
            const updatedColors = colors.map(color => 
                color.id === openDrawerId ? { ...color, color: hexColor } : color
            );
    
            // Update the state with the modified colors array
            setColors(updatedColors);
    
            // Close the drawer after saving
            setDrawerOpen(false);
        }
    };
    

    // Handle Drop
    const handleDrop = (e, dropIndex) => {
        const dragIndex = e.dataTransfer.getData('dragIndex');
        const updatedColors = [...colors];
        const [draggedItem] = updatedColors.splice(dragIndex, 1);
        updatedColors.splice(dropIndex, 0, draggedItem);
        setColors(updatedColors);
    };

    // Edit Item
    const handleEdit = (item) => {
        setEditingItem(item);
        setDrawerOpen(true);
        setOpenDrawerId(item.id);
        setIsColorDrawer(false)
        setHexColor(item.color)
    };

    // Duplicate Item
    const handleDuplicate = (item) => {
        const newItem = { ...item, id: colors.length + 1, title: `${item.title} Copy` };
        setColors([...colors, newItem]);
    };

    // Delete Item
    const handleDelete = (id) => {
        setColors(colors.filter((item) => item.id !== id));
    };

    // Add Item
    const handleAdd = () => {
        const newItem = { id: colors.length + 1, title: 'New Color', color: '#FFFFFF' };
        setColors([...colors, newItem]);
        setEditingItem(newItem);
        setDrawerOpen(true);
    };

    // Save Edit
    const handleSave = (updatedItem) => {
        setColors(colors.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
        setDrawerOpen(false);
        setEditingItem(null);
    };

    const handleDotClick = (id) => {
        setOpenDrawerId(openDrawerId === id ? null : id); // Toggle open/close
        setIsColorDrawer(!isColorDrawer)
    };


    return (
        <div className="kzui__app">
            <h2 className='kzui__header'>Design System</h2>

            <div className='kzui__tabs__Section'>
                <div className='kzui__tabs'>
                    <h3>Color</h3>
                    <h3>Typography</h3>
                    <h3>Shadow</h3>
                </div>
                <input type="text" placeholder='search' />
            </div>

            <div className='kzui__color__div' style={{ width: '70%' }}>
                <h3>Name</h3>
                <h3>Value</h3>
            </div>

            <div style={{ width: '70%' }}>
                {
                    colors.map(color => (
                        <div key={color.id} className='kzui__color__item'>
                            <div className='kzui__color__name'>
                                <img src={colorPalleteIcons} alt="" />
                                <input type="checkbox" name="select" id="" />
                                {color.title}
                            </div>
                            <div className='kzui__color'>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        backgroundColor: color.color,
                                        borderRadius: '5px',
                                        marginRight: '10px',
                                    }}
                                ></div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{color.title}</p>
                                    <p style={{ margin: 0 }}>{color.color}</p>
                                </div>
                            </div>

                            <button onClick={() => handleDotClick(color.id)} className='kzui__dots'>
                                ...
                            </button>

                            {openDrawerId === color.id && isColorDrawer && (
                                <div className='kzui__action__drawer'>
                                    <button onClick={() => handleEdit(color)}>Edit</button>
                                    <button>Duplicate</button>
                                    <button>Delete</button>
                                </div>
                            )}
                        </div>
                    ))
                }
            </div>

            <button className='kzui__add__button'>
                <img src={plusIcons} alt="" />
                Add Color
            </button>

            {
                isDrawerOpen && <div className='kzui__edit__color'>
                    <div className='kzui__edit__color__name'>
                        <div>
                            <label htmlFor="">Name</label>
                            <button onClick={() => {
                                setDrawerOpen(false)
                            }}>X</button>
                        </div>
                        <input type="text" name='edit_color_name' placeholder='Enter Name' />
                    </div>

                    <h4>Value</h4>
                    <div className='kzui__edit__color__value'>
                        <p>{editingItem.title}</p>
                        <div className='kzui__color'>
                            <div
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: editingItem.color,
                                    borderRadius: '5px',
                                    marginRight: '10px',
                                }}
                            ></div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{editingItem.title}</p>
                                <p style={{ margin: 0 }}>{editingItem.color}</p>
                            </div>
                        </div>
                    </div>

                    <div className="kzui__color__picker__container">
                        {/* Hex Color Input Section */}
                        <div className="kzui__color__input">
                            <div
                                className="kzui__color__display"
                                style={{ backgroundColor: hexColor }}
                            ></div>
                            <input
                                type="text"
                                defaultValue={hexColor}
                                onChange={handleHexChange}
                                maxLength={7}
                            />
                            {/* <input type="color" name="" id="" /> */}
                        </div>

                        {/* Save and Cancel Buttons */}
                        <div className="kzui__actions">
                            <button className="kzui__cancel__btn">Cancel</button>
                            <button onClick={handleSaveChange} className="kzui__save__btn">Save Changes</button>
                        </div>
                    </div>
                </div>
            }
        </div>

    );
};


export default ColorTabComponent;
