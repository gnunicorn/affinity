//in app.js
import * as React from "react";
import { render } from "react-dom";
import {
  Admin, Resource, ListGuesser,
  List, Datagrid,
  TextField, ReferenceField, DateField, BooleanField
} from "react-admin";
import {ParseAuth, ParseClient} from 'ra-data-parse';

const parseConfig = {
    URL: window.PARSE_URL,
    JAVASCRIPT_KEY: window.PARSE_JS_KEY,
    APP_ID: window.PARSE_APP_ID,
}

const dataProvider = ParseClient(parseConfig);
const authProvider = ParseAuth(parseConfig);

const ActivityList = (props: any) => (
  <List {...props}>
      <Datagrid rowClick="edit">
          <TextField source="id" />
          <DateField source="createdAt" />
          <DateField source="updatedAt" />
          <TextField source="team.className" />
          <TextField source="author.id" />
          <TextField source="verb" />
          <TextField source="objects" />
          <TextField source="text" />
          <ReferenceField source="ACL.permissionsById" reference="ACL.permissionsBies"><TextField source="id" /></ReferenceField>
          <BooleanField source="bookmarked" />
      </Datagrid>
  </List>
);


render(
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="Team" list={ListGuesser} />
    <Resource name="Activity" list={ActivityList} />
    <Resource name="Picture" list={ListGuesser} />
  </Admin>,
  document.getElementById('app')
);