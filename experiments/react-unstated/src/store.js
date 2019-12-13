import { Container } from 'unstated';
import { findIndex } from 'lodash';

export default class AppContainer extends Container {
    state = {
        lists: [
            {
                name: 'Morning',
                items: [
                    {
                        title: 'Wake Up',
                        done: false
                    },
                    {
                        title: 'Workout',
                        done: true
                    }
                ]
            }
        ]
    };
    addList = (listName) => {
        if (!this.state[listName]) {
            this.setState({ lists: [ ...this.state.lists, { name: listName, items: [] } ] }, () => console.log(this.state));
        }
    }
    addTodo = (listId, todoText) => {
        const listIdx = findIndex(this.state.lists, list => list.name === listId);

        if (listIdx > -1) {
            this.setState(state => {    
                return {
                    lists: state.lists.map((list, idx) => {
                        if (listIdx === idx) {
                            return {
                                name: list.name,
                                items: list.items.concat([ { title: todoText, done: false } ])
                            }
                        } else {
                            return list;
                        }
                    })
                }
            }, () => console.log(this.state))
        }
    }
    toggleTodo = (listId, itemIdx) => {
        const listIdx = findIndex(this.state.lists, list => list.name === listId);

        if (listIdx > -1) {
            this.setState(state => {    
                return {
                    lists: state.lists.map((list, idx) => {
                        if (listIdx === idx) {
                            return {
                                name: list.name,
                                items: list.items.map((item, idx) => {
                                    if (idx === itemIdx) {
                                        return { ...item, done: !item.done };
                                    } else {
                                        return item;
                                    }
                                })
                            }
                        } else {
                            return list;
                        }
                    })
                }
            }, () => console.log(this.state))
        }
    }
}

export const appStateContainer = new AppContainer();