import React, {Component} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap'
import './NumberPicker.css';

class NumberPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        }
    }

    changeValue = (diff) => {
        const min = this.props.min ? this.props.min : 0;
        const max = this.props.max ? this.props.max : 100;
        let newValue = this.state.value + diff;
        if(newValue < min) newValue = min;
        if(newValue > max) newValue = max;
        this.setState({value: newValue});
        this.props.onChange(newValue);
    };

    render() {
        return (
            <div>
                <ButtonGroup>
                    <Button variant={"light"} onClick={() => this.changeValue(-1)}>
                        -1
                    </Button>
                    <Button variant={"light"} onClick={() => this.changeValue(-10)}>
                        -10
                    </Button>
                    <div className={'number-display'}>
                        <span className={"number-display-value"}>
                            {this.state.value === 0 && this.props.zeroText ?
                                this.props.zeroText
                                :
                                this.state.value}
                        </span>
                    </div>
                    <Button variant={"light"} onClick={() => this.changeValue(10)}>
                        +10
                    </Button>
                    <Button variant={"light"} onClick={() => this.changeValue(1)}>
                        +1
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default NumberPicker;