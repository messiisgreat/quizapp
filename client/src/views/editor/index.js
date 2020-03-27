import React from 'react'
import CenterBox from "../../components/CenterBox";
import {Container, Row, Col, Button, Modal} from 'react-bootstrap'
import './Editor.css';
import QuestionExplorer from "../../components/QuestionExplorer";
import QuestionEditor from "../../components/QuestionEditor";
import Downloader from 'react-file-download'
import testQuestion from '../../testQuestions';

import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalName: '',
            workspace: [],
            selectedIndex: -1,
            changed: false,
            exitModal: false,
            deleteModal: false
        }
    }

    componentDidMount() {
        this.setState({
            workspace: testQuestion
        })
    }

    changeSelecion = (index) => {
        this.setState({
            selectedIndex: index
        })
    };

    exitButton = () => {
        if(this.state.changed) {
            this.setState({exitModal: true})
        }else{
            this.props.history.push('/');
        }
    };

    uploadFile = () => {
        //TODO upload
    };

    downloadFile = () => {
        let name = this.state.originalName;
        if(name === '') {
            name = prompt('Podaj nazwę projektu lub pozostaw pole puste:');
            if(name === '') {
                name = 'question.json';
            }else{
                name += '.json';
                this.setState({originalName: name});
            }
        }
        Downloader(JSON.stringify(this.state.workspace, null, 2), name, 'application/json');
    };

    moveQuestion = (diff) => {
        const oldIndex = this.state.selectedIndex;
        const newIndex = oldIndex + diff;
        let newData = this.state.workspace.slice();
        newData.splice(newIndex, 0, newData.splice(oldIndex, 1)[0]);
        this.setState({
            workspace: newData,
            selectedIndex: newIndex,
            changed: true
        });
    };

    deleteQuestion = (confirmed) => {
        if(this.state.selectedIndex >= 0) {
            if(confirmed) {
                let newData = this.state.workspace.slice();
                newData.splice(this.state.selectedIndex, 1);
                let newIndex = this.state.selectedIndex;
                if(newIndex >= newData.length) newIndex = newData.length - 1;
                this.setState({
                    deleteModal: false,
                    workspace: newData,
                    selectedIndex: newIndex,
                    changed: true
                });
            }else{
                this.setState({deleteModal: true});
            }
        }
    };

    addQuestion = (onCurrentIndex) => {
        if(onCurrentIndex) {
            let newData = this.state.workspace.slice();
            newData.splice(this.state.selectedIndex + 1, 0, {
                question: '',
                correct: 0,
                answers: ['', '', '', '']
            });
            this.setState({
                workspace: newData,
                selectedIndex: this.state.selectedIndex + 1,
                changed: true
            });
        }else{
            this.setState({
                workspace: [...this.state.workspace, {
                    question: '',
                    correct: 0,
                    answers: ['', '', '', '']
                }],
                selectedIndex: this.state.workspace.length,
                changed: true
            });
        }
    };

    topButtonsConfig = () => [
        {
            text: 'Wyjdź',
            icon: <CloseIcon/>,
            click: this.exitButton
        },
        {
            customUpload: true,
            text: 'Wgraj',
            icon: <PublishIcon/>,
            click: this.uploadFile
        },
        {
            variant: 'success',
            text: 'Pobierz',
            icon: <GetAppIcon/>,
            click: this.downloadFile,
            disabled: this.state.workspace.length === 0
        },
        {
            text: 'Przesuń w górę',
            icon: <ArrowUpwardIcon/>,
            click: () => this.moveQuestion(-1),
            disabled: this.state.selectedIndex < 1
        },
        {
            text: 'Przesuń w dół',
            icon: <ArrowDownwardIcon/>,
            click: () => this.moveQuestion(1),
            disabled: this.state.selectedIndex < 0 || this.state.selectedIndex + 1 === this.state.workspace.length
        },
        {
            text: 'Usuń',
            icon: <DeleteForeverIcon/>,
            click: () =>this.deleteQuestion(false),
            disabled: this.state.selectedIndex < 0
        },
        {
            text: 'Dodaj tutaj',
            icon: <AddBoxIcon/>,
            click: () => this.addQuestion(true)
        },
        {
            text: 'Dodaj na końcu',
            icon: <AddBoxIcon/>,
            click: () => this.addQuestion(false)
        }
    ];

    updateQuestion = (data) => {
        if(this.state.selectedIndex >= 0) {
            let newData = this.state.workspace.slice();
            newData[this.state.selectedIndex] = data;
            this.setState({
                workspace: newData,
                changed: true
            });
        }
    };

    render() {
        return(
            <CenterBox {...this.props}>
                <Container fluid className={"editor-container d-none d-sm-none d-md-block"}>
                    <Row style={{height: '100%'}}>
                        <Col xl={4} lg={4} md={4} sm={12}>
                            <QuestionExplorer questions={this.state.workspace}
                                              selectedIndex={this.state.selectedIndex}
                                              selected={this.changeSelecion}/>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={12}>
                            <div className={"question-editor"}>
                                <Container fluid>
                                    <Row noGutters>
                                        {
                                            this.topButtonsConfig().map(btn => {
                                                if(btn.customUpload) {
                                                    return(
                                                        <Col lg={4} md={6} key={btn.text}>
                                                            <span className={"btn btn-secondary btn-file editor-button"}>
                                                                {btn.icon}
                                                                {(btn.icon ? ' ' : '') + btn.text}
                                                                <input type={"file"} accept={"application/json"}/>
                                                            </span>
                                                        </Col>
                                                    );
                                                }else{
                                                    return(
                                                        <Col lg={4} md={6} key={btn.text}>
                                                            <Button variant={btn.variant ? btn.variant : 'secondary'}
                                                                    className={"editor-button"}
                                                                    onClick={btn.click}
                                                                    disabled={btn.disabled}>
                                                                {btn.icon}
                                                                {(btn.icon ? ' ' : '') + btn.text}
                                                            </Button>
                                                        </Col>
                                                    );
                                                }
                                            })
                                        }
                                    </Row>
                                    <Row>
                                        <QuestionEditor question={this.state.selectedIndex < 0 ? null : this.state.workspace[this.state.selectedIndex]}
                                                        update={this.updateQuestion}/>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Modal show={this.state.exitModal} onHide={() => this.setState({exitModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ostrzeżenie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Wykryto w projekcie niepobierane zmiany!<br/>Czy na pewno chcesz wyjść z edytora?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.props.history.push('/')}>Tak, wyjdź</Button>
                        <Button variant="secondary" onClick={() => this.setState({exitModal: false})}>Nie, anuluj</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.deleteModal} onHide={() => this.setState({deleteModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ostrzeżenie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Na pewno chcesz usunąć to pytanie?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.deleteQuestion(true)}>Tak, usuń</Button>
                        <Button variant="secondary" onClick={() => this.setState({deleteModal: false})}>Nie, anuluj</Button>
                    </Modal.Footer>
                </Modal>
            </CenterBox>
        );
    }
}

export default Editor