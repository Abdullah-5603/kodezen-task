import React, { useEffect, useRef, useState } from 'react';
import './ColorTabComponent.css';
import colorPalleteIcons from '../../assets/Icons/pallete.png';
import plusIcons from '../../assets/Icons/plus.png';
import sixDotsIcons from '../../assets/Icons/six-dots.png';
import { generateUniqueId } from '../../utils';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

const initialColors = [
    { id: 1, title: 'Primary', color: '#FF0000' },
    { id: 2, title: 'Secondary', color: '#00FF00' },
    { id: 3, title: 'Title Text', color: '#0000FF' },
    { id: 4, title: 'Supporting Text', color: '#FFFF00' },
];

// Create a drag handle component
// const DragHandle = SortableHandle(() => (
//     <img className="kzui-drag-icon" src={sixDotsIcons} alt="Drag Handle" />
// ));


const SortableItem = SortableElement(({ color, onEdit, onDuplicate, onDelete, openDrawerId, handleDotClick }) => (
    <div className="kzui-color-item">
        <div className="kzui-color-name">
            <img className='kzui-drag-icon' src={sixDotsIcons} alt="" />
            
            {/* <DragHandle /> */}
            <img className='kzui-color-palate-icon' src={colorPalleteIcons} alt="" />
            <input type="checkbox" name="select" id="" className="kzui-color-item__name-input" />
            {color.title}
        </div>
        <div className="kzui-color">
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color.color,
                    borderRadius: '5px',
                    marginRight: '10px',
                }}
            ></div>
            <div>
                <p style={{ margin: 0 }}>{color.color}</p>
            </div>
        </div>
        <button onClick={() => handleDotClick(color.id)} className="kzui-dots">
            ...
        </button>
        {openDrawerId === color.id && (
            <div className="kzui-action-drawer">
                <button onClick={() => onEdit(color)} className="kzui-action-drawer__button">Edit</button>
                <button onClick={() => onDuplicate(color)} className="kzui-action-drawer__button">Duplicate</button>
                <button onClick={() => onDelete(color.id)} className="kzui-action-drawer__button">Delete</button>
            </div>
        )}
    </div>
));

const SortableList = SortableContainer(({ colors, onEdit, onDuplicate, onDelete, openDrawerId, handleDotClick }) => {
    return (
        <div>
            {colors.map((color, index) => (
                <SortableItem
                    key={`item-${color.id}`}
                    index={index}
                    color={color}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    openDrawerId={openDrawerId}
                    handleDotClick={handleDotClick}
                    // useDragHandle
                />
            ))}
        </div>
    );
});

const ColorTabComponent = () => {
    const [colors, setColors] = useState(initialColors);
    const [openDrawerId, setOpenDrawerId] = useState('');
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState({});
    const [hexColor, setHexColor] = useState('');
    const [activeTab, setActiveTab] = useState('Color');
    const formRef = useRef(null);

    const handleTabClick = (tabName) => setActiveTab(tabName);

    const handleHexChange = (e) => {
        const value = e.target.value;
        if (value.match(/^#([0-9A-F]{3}){1,2}$/i) || value === '') {
            setHexColor(value);
        }
    };

    const handleSaveChange = (e) => {
        e.preventDefault();
        const colorTitle = e.target.edit_color_name.value;
        const matchedColor = colors.find((color) => color.id === openDrawerId);

        if (matchedColor && hexColor) {
            const updatedColors = colors.map((color) =>
                color.id === openDrawerId ? { ...color, color: hexColor, title: colorTitle } : color
            );
            setColors(updatedColors);
            setDrawerOpen(false);
            setOpenDrawerId('');
        } else {
            const newColor = {
                id: generateUniqueId(),
                title: colorTitle,
                color: hexColor,
            };
            setColors([...colors, newColor]);
            setDrawerOpen(false);
            setOpenDrawerId('');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setDrawerOpen(true);
        setOpenDrawerId(item.id);
        setHexColor(item.color);
    };

    const handleDuplicate = (item) => {
        const newItem = {
            ...item,
            id: generateUniqueId(),
            title: `${item.title} Copy`,
        };
        setColors([...colors, newItem]);
        setOpenDrawerId('');
    };

    const handleDelete = (id) => setColors(colors.filter((item) => item.id !== id));

    const handleDotClick = (id) => setOpenDrawerId(openDrawerId === id ? null : id);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newColors = arrayMoveImmutable(colors, oldIndex, newIndex);
        setColors(newColors);
    };

    // Close the drawer when clicking outside the form
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setDrawerOpen(false);
                setOpenDrawerId('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="kzui-app">
            <h2 className="kzui-header">Design System</h2>
            <div className="kzui-tabs-Section">
                <div className="kzui-tabs">
                    {['Color', 'Typography', 'Shadow'].map((tab) => (
                        <h3
                            key={tab}
                            className={`kzui-tabs__title ${activeTab === tab ? 'kzui-tabs__title--active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                        </h3>
                    ))}
                </div>
                <input type="text" placeholder="search" />
            </div>
            <div className="kzui-color-div">
                <h3>Name</h3>
                <h3>Value</h3>
            </div>

            <SortableList
                colors={colors}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                openDrawerId={openDrawerId}
                handleDotClick={handleDotClick}
                onSortEnd={onSortEnd}
                // axis="y"
                // useDragHandle={true}

            />

            <button
                onClick={() => {
                    setDrawerOpen(true);
                    setEditingItem({ id: colors.length + 1, title: 'New Color', color: '#FFFFFF' });
                    setHexColor('#FFFFFF');
                }}
                className="kzui-add-button"
            >
                <img src={plusIcons} alt="" className="kzui-add-button__icon" />
                Add Color
            </button>

            {isDrawerOpen && (
                <form ref={formRef} onSubmit={handleSaveChange} className="kzui-edit-color">
                    <div className="kzui-edit-color__name">
                        <div className="kzui-edit-color__header">
                            <label htmlFor="edit_color_name">Name</label>
                            <button onClick={() => {
                                setDrawerOpen(false)
                                setOpenDrawerId('')
                            }}>X</button>
                        </div>
                        <input
                            type="text"
                            name="edit_color_name"
                            defaultValue={editingItem.title}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                            required
                        />
                    </div>

                    <h4>Value</h4>
                    <div className="kzui-edit-color__value">
                        <p>{editingItem.title}</p>
                        <div className="kzui-color">
                            <div
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: hexColor,
                                    borderRadius: "5px",
                                    marginRight: "10px",
                                }}
                            ></div>
                            <div>
                                <p style={{ margin: 0 }}>{hexColor}</p>
                            </div>
                        </div>
                    </div>

                    <div className="kzui-color-picker">
                        <div className="kzui-color-picker__input">
                            <div
                                className="kzui-color-picker__display"
                                style={{ backgroundColor: hexColor }}
                            ></div>
                            <input
                                type="text"
                                defaultValue={hexColor}
                                onChange={handleHexChange}
                                maxLength={7}
                            />
                        </div>

                        <div className="kzui-actions">
                            <button type="button" className="kzui-actions__cancel-btn" onClick={() => {
                                setDrawerOpen(false)
                                setOpenDrawerId('')
                            }}>
                                Cancel
                            </button>
                            <button type="submit" className="kzui-actions__save-btn">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ColorTabComponent;
