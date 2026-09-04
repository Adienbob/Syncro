import { describe, expect, it } from "vitest";
import { getRole } from "./getRole";
import { demoState } from "@/app/state/initialState";

const members = demoState.members

describe("Test getRole function", () => {

   it("if userId undefined show undefined", () => {
      expect(getRole(members, "56c34f91-e969-4b9b-9f83-003f49ad4ced")).toBe(undefined)
   }) 

   it("if userId wrong show undefined", () => {
      expect(getRole(members, "56c34f91-e969-4b9b-9f83-003f49ad4ced", "wrong_userId")).toBe(undefined)
   }) 
   
   it("if boardId wrong show undefined", () => {
      expect(getRole(members, "56c34f91-e969-4b9b-9f83-003f49ad4cedsss", "demo-hussien")).toBe(undefined)
   }) 
   
   it("if correct boardId and correct userId show Role", () => {
      expect(getRole(members, "56c34f91-e969-4b9b-9f83-003f49ad4ced", "demo-hussien")).toBe("owner")
   }) 
      
   it("if members empty show undefined", () => {
      expect(getRole([], "56c34f91-e969-4b9b-9f83-003f49ad4ced", "demo-hussien")).toBe(undefined)
   }) 

})