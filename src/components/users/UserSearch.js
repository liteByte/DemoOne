import React from "react";
import {Cell, Row, Table} from "react-responsive-table";
import TextField from "material-ui/TextField";
import FontIcon from "material-ui/FontIcon";

const styles = {
  margin: "auto 10px 2px 10px"
};

const searchLabelStyles = {
  margin: "auto 10px 2px 10px",
  display: "flex",
  alignItems: "center",
};

export default class UserSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tipoDoc: "dni"
    };
  }

  render() {
    return (
      <Table material style={{padding: 0}}>
        <form>
          <Row key="typeDocRow">
            <Cell key="searchlabel" style={searchLabelStyles}>
              <FontIcon className="material-icons">search</FontIcon>
              <p style={{marginLeft: 10}}>Buscador</p>
            </Cell>
            <Cell minWidthPx={150} key="nameText" style={styles}>
              <TextField onChange={this.props.searchName} hintText="Nombre y Apellido"/>
            </Cell>
            <Cell minWidthPx={150} key="docText" style={styles}>
              <TextField type="number" onChange={this.props.searchDocument} hintText="Nro de Documento"/>
            </Cell>
          </Row>
        </form>
      </Table>
    )
  }
}

UserSearch.contextTypes = {
  router: React.PropTypes.object.isRequired
};

UserSearch.PropTypes = {
  searchDocument: React.PropTypes.func,
  searchName: React.PropTypes.func
};
