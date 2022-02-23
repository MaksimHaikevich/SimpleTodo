import AppHeader from "../app-header/app-header";
import {SearchPanel} from "../search-panel/search-panel";
import ItemStatusFilter from "../item-status-filter/item-status-filter";
import TodoList from "../todo-list/todo-list";
import React, {Component} from "react";
import './app.css'
import {ItemAddForm} from "../add-list-item/item-add-form";
import {v1} from "uuid";


export class App extends Component {

    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Have a lunch'),
        ],
        term: '',
        filter: 'all'
    }

    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: v1()
        }
    }

    deleteItem = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: [...todoData.filter(el => el.id !== id)]
            }
        })
    }
    addItem = (text) => {
        this.setState(({todoData}) => {
            const newTask = this.createTodoItem(text)
            return {
                todoData: [...todoData, newTask]
            }
        })
    }

    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex((el) => el.id === id)
        const oldItem = arr[idx]
        const newItem = {...oldItem, [propName]: !oldItem[propName]}
        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ]
    }

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        })
    }
    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            }
        })
    }
    onSearchChange = (term) => {
        this.setState({term})
    }
    onFilterChange = (filter) => {
        this.setState({filter})
    }

    search(items, term) {
        if (term.length === 0) {
            return items
        }

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
        })

    }

    filter(items, filter) {
        switch (filter) {
            case 'all':
                return items
            case  'active':
                return items.filter(item => !item.done)
            case 'done':
                return items.filter(item => item.done)
            default:
                return items
        }
    }


    render() {
        const {todoData, term, filter} = this.state

        const visibleItems = this.filter(this.search(todoData, term), filter)
        const doneCount = todoData.filter(el => el.done).length
        const todoCount = todoData.length - doneCount


        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel
                        onSearchChange={this.onSearchChange}
                    />
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}
                    />
                </div>

                <TodoList
                    todos={visibleItems}
                    onDeleted={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}
                />
                <ItemAddForm onAddNewTask={this.addItem}/>
            </div>
        );
    }
}