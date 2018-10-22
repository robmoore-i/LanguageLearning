import {TranslationProduction }from "../../main/TranslationProduction";
import {ObjectBuilder} from "../../main/ObjectBuilder";
import ProductionVariable from "../../main/ProductionVariable";

it('Can make a translation question', () => {
    let tp = TranslationProduction((name) => "Hello " + name, (name) => "გამარჯობა " + name, [ProductionVariable.NAME])
    let input = ObjectBuilder().put(ProductionVariable.NAME, "Iris").build()
    let tq = tp.using(input)

    expect(tq.type).toEqual(0)
    expect(tq.given).toEqual("Hello Iris")
    expect(tq.answer).toEqual("გამარჯობა Iris")
})