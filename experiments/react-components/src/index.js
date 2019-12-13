import React from 'react';
import ReactDOM from 'react-dom';

import Tabcordion, {
    Tab,
    TabPanel
} from './components/Tabcordion';
import {
    Form,
    Radio,
    InputGroup,
    Select,
    Text,
    Checkbox,
    GroupCheckbox,
} from './components/Form';
import {
    hasInput,
    isInRange,
    isMin,
    isNumber,
    phoneMask2,
} from './components/Form/utilities';
import Audio from './components/Audio';
import { SuperAudio } from './components/Audio/super';
import { getFormattedNumber, getCleanNumber } from './utilities';

const trackURL = require('../test-assets/test.mp3');

function mustBeKeeley(val, formVals) {
    return typeof(val) !== 'undefined' && val === 'keeley';
}

function mustBeSame(val, formVals) {
    return typeof(val) === 'string' && val === formVals['first-name'];
}

// function mustNotBeKeeley(val, formVals) {
//     return val && val !== 'keeley' && val !== formVals['first-name'] ? true : 'Nickname can\'t be "Keeley"';
// }

const mustNotBeKeeley = username => new Promise((resolve, reject) => {
    setTimeout(() => {
        // Simulate username check
        if (['keeley'].includes(username)) {
            resolve([ 'Username taken.' ]);
        } else if (!hasInput(username)) {
            resolve([ 'Must fill out field.' ]);
        }
        // Simulate request faulure
        if (username === 'reject') {
            reject([ 'Failure while making call to validate username does not exist' ]);
        }

        // Sumulate username success check
        resolve([]);
    }, 2000)
  }
)


class App extends React.Component {
    constructor(props) {
        super(props);
        this.firstName = React.createRef();
    }
    render() {
        return (
            <div className={'row'}>
                <div className={'sm-col-12 lg-center-col-6'}>
                    <Audio id={'test-audio'} progressColor={'red'} src={trackURL} />
                    {/* <SuperAudio id={'test-audio-2'} src={trackURL} /> */}
                    <Form getApi={(api => this.api = api)} errorLimit={1}>
                        <label htmlFor={'first-name'} className={'basic-label'}>First Name</label>
                        <Text
                            className={'basic-input'}
                            field={'first-name'}
                            id={'first-name'}
                            validateOnBlur
                            validate={{
                                errorMsg: 'First name must be keeley.',
                                test: mustBeKeeley,
                            }}
                            forwardedRef={this.firstName}
                            notify={['last-name']}
                        />

                        <label htmlFor={'last-name'} className={'basic-label'}>Last Name</label>
                        <Text
                            className={'basic-input'}
                            field={'last-name'}
                            id={'last-name'}
                            validate={{
                                errorMsg: 'Last name must match first name',
                                test: mustBeSame,
                            }}
                            notify={['first-name']}
                        />

                        <label htmlFor={'some-number'} className={'basic-label'}>Some Number</label>
                        <Text
                            className={'basic-input'}
                            field={'some-number'}
                            id={'some-number'}
                            validate={[
                                {
                                    errorMsg: 'Must be a number.',
                                    test: isNumber,
                                },
                                {
                                    errorMsg: 'Must be greater than 10.',
                                    test: isInRange(4,10),
                                }
                            ]}
                            mask={getCleanNumber}
                            notify={['first-name']}
                        />

                        <label htmlFor={'nickname'} className={'basic-label'}>Nickname</label>
                        <Text
                            className={'basic-input'}
                            field={'nickname'}
                            id={'nickname'}
                            asyncValidateOnBlur
                            asyncValidate={mustNotBeKeeley}
                            validate
                            notify={['first-name', 'last-name']}
                        />


                        <label htmlFor={'some-select'} className={'basic-label'}>Some Select</label>
                        <Select
                            field={'some-select'}
                            id={'some-select'}
                            validate
                        >
                            <option></option>
                            <option value={1}>one</option>
                            <option value={2}>two</option>
                            <option value={3}>three</option>
                        </Select>

                        <label htmlFor={'nested'} className={'basic-label'}>Nested</label>
                        <Text
                            className={'basic-input'}
                            validate
                            field={'nested.poop'}
                            id={'nested'}
                            // maskOnChange
                            mask={phoneMask2}
                        />

                        <label htmlFor={'dumb-field'} className={'basic-label'}>Unimportant</label>
                        <Text
                            className={'basic-input'}
                            field={'dumb-field'}
                            id={'dumb-field'}
                        />

                        <div className={'row sm-pad-v2'}>
                            <div className={'sm-col-12'}>
                                <InputGroup field="gender" validate>
                                    <label htmlFor="radio-male">Male</label>
                                    <Radio value="male" id="radio-male" />
                                    <label htmlFor="radio-female">Female</label>
                                    <Radio value="female" id="radio-female" />
                                </InputGroup>
                            </div>
                        </div>

                        <div className={'row sm-pad-v2'}>
                            <div className={'sm-col-12'}>
                                <InputGroup field="ice-cream">
                                    <label htmlFor="ice-cream-chocolate">Chocolate</label>
                                    <GroupCheckbox value="chocolate" id="ice-cream-chocolate" />
                                    <label htmlFor="ice-cream-vanilla">Vanilla</label>
                                    <GroupCheckbox value="vanilla" id="ice-cream-vanilla" />
                                </InputGroup>
                            </div>
                        </div>

                        <div className={'row sm-pad-v2'}>
                            <div className={'sm-col-12'}>
                                <InputGroup field="one-ice-cream" multiselect={false}>
                                    <p>Choose One Flavor</p>
                                    <label htmlFor="one-ice-cream-chocolate">Chocolate</label>
                                    <GroupCheckbox value="chocolate" id="one-ice-cream-chocolate" />
                                    <label htmlFor="one-ice-cream-vanilla">Vanilla</label>
                                    <GroupCheckbox value="vanilla" id="one-ice-cream-vanilla" />
                                </InputGroup>
                            </div>
                        </div>

                        <div className={'row sm-pad-v2'}>
                            <div className={'sm-col-12'}>
                                <label htmlFor="agree">Agree To Stuff?</label>
                                <Checkbox field={'agree'} id="agree" />
                            </div>
                        </div>

                        <button type={'submit'} className={'momappoki-btn'}>Submit</button>
                        <button type={'button'} className={'momappoki-btn secondary'} onClick={() => this.api.setValues({ 'first-name': 'poop', 'nested.poop': 'farts'}, false)}>Do Stuff</button>
                        <button type={'button'} className={'momappoki-btn secondary'} onClick={() => console.log(this.api.getErrors())}>Get Errors</button>
                    </Form>
                </div>
            </div>
        )
    }
    // render() {
    //     return (
    //         <Tabcordion initialTab="tab-2">
    //             <Tab id="tab-1">Huh</Tab>
    //             <Tab id="tab-2">Whut</Tab>
    //             <Tab id="tab-3">Hey</Tab>
    //             <TabPanel id="tab-1">Huh</TabPanel>
    //             <TabPanel id="tab-2">Whut</TabPanel>
    //             <TabPanel id="tab-3">Hey</TabPanel>
    //         </Tabcordion>
    //     )
    // }
}

const appRoot = document.getElementById('app');
ReactDOM.render(<App />, appRoot);
