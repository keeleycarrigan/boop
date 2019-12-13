import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Provider, Subscribe } from 'unstated';

import { convertKeyCode } from './utilities';
import { Row } from './layout';
import { ConnectToDoList } from './todo';
import { appStateContainer } from './store';

function App () {
    function addNewList (app, e) {
        const { isEnter } = convertKeyCode(e);
        
        if (isEnter) {
            e.preventDefault();
            const newListName = e.target.value;
            e.target.blur();

            if (newListName.trim().length) {
                app.addList(newListName);
                e.target.value = '';
            }
        }
    }
    function renderList (list, idx, allLists) {
        return (
            <Grid key={`${list.name}-${idx}`} item xs={12} sm={6}>
                <Typography variant={'h6'}>{list.name}</Typography>
                <ConnectToDoList id={list.name} />
                <Subscribe to={[ appStateContainer ]}>
                    {app => (
                        <TextField
                            id={`add-list-${list.name}-todo`}
                            variant={'outlined'}
                            label={'Add Todo'}
                            onKeyDown={(e) => {
                                const { isEnter } = convertKeyCode(e);
        
                                if (isEnter) {
                                    e.preventDefault();
                                    const newTodoText = e.target.value.trim();
                                    e.target.blur();

                                    if (newTodoText.length) {
                                        app.addTodo(list.name, newTodoText);
                                        e.target.value = '';
                                    }
                                }
                            }}
                        />
                    )}
                </Subscribe>
            </Grid>
        )
    }
    return (
        <Provider>
            <CssBaseline />
            <Subscribe to={[ appStateContainer ]}>
                {app => (
                    <React.Fragment>
                    <Row>
                        {app.state.lists.map(renderList)}
                    </Row>
                    <Row>
                        <Grid item xs={12}>
                            <TextField
                                id={'add-new-list-field'}
                                variant={'outlined'}
                                label={'Add New List'}
                                onKeyDown={addNewList.bind(null, app)}
                            />
                        </Grid>
                    </Row>
                    </React.Fragment>
                )}
            </Subscribe>
        </Provider>
    )
}

const appContainer = document.getElementById('app');
ReactDOM.render(<App />, appContainer);