import React from "react";
import {rest} from 'msw';
import { setupServer } from 'msw/node'
import { fireEvent, screen } from '@testing-library/react'
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from '../../app/test-utils'
import UserList from "./PostList";
import App from "../../App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { JsxElement } from "typescript";


export const handlers = [
   rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
      console.log("Get api request recived ")
     return res(ctx.json([{
      "userId": 1,
      "id": 1,
      "title": "sunt aut facere repellat ",
      "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
     },{
      "userId": 1,
      "id": 2,
      "title": "post two tilte",
      "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"

     }]), ctx.delay(150))
   }),


   rest.delete('https://jsonplaceholder.typicode.com/posts/2', (req, res, ctx) => {
      console.log("delete api request recived ")
     return res(ctx.status(200), ctx.delay(150))
   }),


   rest.post('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
      console.log("Add post api request recived ")
     return res(ctx.status(200), ctx.delay(150))
   }),

   

   rest.put('https://jsonplaceholder.typicode.com/posts/2', (req, res, ctx) => {
      console.log("Update post api request recived ")
     return res(ctx.status(200), ctx.delay(150))
   })

 ]

 const server = setupServer(...handlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())




describe("Posts in the table tests",  () => {


   it('Checking  for List is loading ', async () => {
      renderWithProviders(<App />)
      expect(await screen.findByText(/List is loading/i)).toBeInTheDocument()
   })


   it('Checking for is no error in loading',  () => {
      renderWithProviders(<App />)
      expect( screen.queryByText(/Error while loading list/i)).not.toBeInTheDocument();
   
   })


   it('Checking for first post loaded',  async () => {
      renderWithProviders(<App />)
      expect(await screen.findByText(/sunt aut facere repellat/i)).toBeInTheDocument();
   
   })


   it('Checking for view delete edit buttons loaded',  async () => {
      renderWithProviders(<App />)
      expect(await screen.findAllByTestId("editbtn1")).toBeTruthy();   
      expect(await screen.findAllByTestId("viewbtn1")).toBeTruthy();
      expect(await screen.findAllByTestId("deletebtn1")).toBeTruthy();   
   })


   it('Checking for view button modal opening',  async () => {
      renderWithProviders(<App />)
     
      expect(await screen.findByTestId("viewbtn1")).toBeTruthy();
       fireEvent.click(await screen.findByTestId("viewbtn1"))
       expect(await screen.findByText(/Post Details/i)).toBeInTheDocument();
        
   })


   it('Checking for delete button action',  async () => {
      renderWithProviders(<App />)
     
      expect(await screen.findByTestId("deletebtn1")).toBeTruthy();
       fireEvent.click(await screen.findByTestId("deletebtn1"))
       setTimeout(function () {
         expect(screen.queryByText(/post two tilte/i)).not.toBeInTheDocument();
     }, 1000);
       
        
   })


   



})


describe("Form component Update/Edit post test", () => {

   it('Checking  for form loaded ', async () => {
      renderWithProviders(<App />)

      expect(await screen.findByTestId("editbtn1")).toBeTruthy();
      fireEvent.click(await screen.findByTestId("editbtn1"))
      expect(await screen.findByText(/Form to add and edit post/i)).toBeInTheDocument()
   })


   it('Checking for edit post form loaded with previous data', async () => {
      renderWithProviders(<App />)

      // expect(await screen.findByTestId("editbtn1")).toBeTruthy();
      // fireEvent.click(screen.getByTestId("editbtn1"))
      setTimeout(function () {
         expect(screen.getByTestId(/Title/i)).toHaveValue("post two tilte")
     }, 1000);
   })


   it('Checking for edit post form and updating action', async () => {
      renderWithProviders(<App />)


      const titleinput =  screen.getByTestId("Title");
      fireEvent.change(titleinput, {target: {value: 'new tilte'}})
      const bodyinput =  screen.getByTestId("Body");
      fireEvent.change(bodyinput, {target: {value: 'new body'}})
      const no =  screen.getByTestId("Userid");
      fireEvent.change(bodyinput, {target: {value: 1}})
      fireEvent.click(screen.getByTestId("submit")) 



   })


} )


describe("Add new post", () => {
   it("add new post", async() => {
      renderWithProviders(<App/>)

      fireEvent.click(screen.getByTestId("addPostbtn"))
      const titleinput =  screen.getByTestId("Title");
      fireEvent.change(titleinput, {target: {value: 'New changed tilte'}})
      const bodyinput =  screen.getByTestId("Body");
      fireEvent.change(bodyinput, {target: {value: 'new body'}})
      const no =  screen.getByTestId("Userid");
      fireEvent.change(bodyinput, {target: {value: 1}})
      fireEvent.click(screen.getByTestId("submit")) 



   })


   it("checking updated post in dashboard" , async() => {
      renderWithProviders(<App/>)

      fireEvent.click(screen.getByTestId("addPostbtn"))
      const titleinput =  screen.getByTestId("Title");
      fireEvent.change(titleinput, {target: {value: 'post two title'}})
      const bodyinput =  screen.getByTestId("Body");
      fireEvent.change(bodyinput, {target: {value: 'new body'}})
      const no =  screen.getByTestId("Userid");
      fireEvent.change(bodyinput, {target: {value: 1}})
      fireEvent.click(screen.getByTestId("submit")) 


      fireEvent.click(screen.getByTestId("dashboardbtn"))
      expect(await screen.findByText(/post two tilte/i)).toBeInTheDocument()


   })

})


