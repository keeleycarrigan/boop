import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Subscribe } from 'unstated';
import {
    find,
    get
} from 'lodash';

import { appStateContainer } from './store';



function renderChecklistItem (id, { title, done, onClick }, idx) {
    function toggleTodo (app) {
        app.toggleTodo(id, idx)
    }
    return (
        <Subscribe to={[ appStateContainer ]} key={`${title}-${idx}`}>
            {app => (
                <li>
                    <ListItem button dense onClick={toggleTodo.bind(null, app)}>
                        <Checkbox checked={done} tabIndex={-1} />
                        <ListItemText primary={title} />
                    </ListItem>
                </li>
            )}
        </Subscribe>
    )
}

export default function TodoList ({ id, items }) {
    return (
        <List>
            {items.map(renderChecklistItem.bind(null, id))}
        </List>
    )
}

export function ConnectToDoList ({ id }) {
    console.log(id)
    return (
        <Subscribe to={[ appStateContainer ]}>
            {app => (
                <TodoList id={id} items={get(find(app.state.lists, ['name', id]), 'items', [])} />
            )}
        </Subscribe>
    );
}