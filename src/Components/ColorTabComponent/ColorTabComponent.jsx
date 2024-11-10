import React, { useState } from 'react';
// import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import  arrayMove  from 'array-move';
import './ColorTabComponent.css';
import colorPalleteIcons from '../../assets/Icons/pallete.png'
import plusIcons from '../../assets/Icons/plus.png'

const initialColors = [
    { id: 1, title: 'Primary', color: '#FF0000' },
    { id: 2, title: 'Secondary', color: '#00FF00' },
    { id: 3, title: 'Title Text', color: '#0000FF' },
    { id: 4, title: 'Supporting Text', color: '#FFFF00' }, // New color added
];



const ColorTabComponent = () => {
    const [colors, setColors] = useState(initialColors);
    const [menuOpen, setMenuOpen] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Handle Drag Start
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('dragIndex', index);
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

            <div className='kzui__color__div'>
                {/* <div> */}
                <h3>Name</h3>
                <h3>Value</h3>
                {/* </div> */}
            </div>

            {
                colors.map(color => (
                    <div key={color.id} className='kzui__color__item kzui__color__item__hover'>
                        <p className='kzui__color__name'>
                            <img src={colorPalleteIcons} alt="" />
                            <input type="checkbox" name="select" id="" />
                            {color.title}
                        </p>
                        <div className='kzui__color'>
                            <div
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: color.color,
                                    borderRadius: '5px',
                                    marginRight: '10px'
                                }}
                            ></div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{color.title}</p>
                                <p style={{ margin: 0 }}>{color.color}</p>
                            </div>
                        </div>

                        <div className='kzui__dots'>

                        </div>
                    </div>
                ))
            }

            <button className='kzui__add__button'>
                <img src={plusIcons} alt="" />
                Add Color
            </button>

        </div>
    );
};


export default ColorTabComponent;
