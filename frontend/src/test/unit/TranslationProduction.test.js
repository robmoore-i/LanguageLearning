import {TranslationProduction }from "../../main/TranslationProduction";
import {ObjectBuilder} from "../../main/ObjectBuilder";
import ProductionVariable from "../../main/ProductionVariable";

it('Can make a translation question with a constant input', () => {
    let tp = TranslationProduction((name) => "Hello " + name, (name) => "გამარჯობა " + name, [ProductionVariable.NAME])
    let input = ObjectBuilder().put(ProductionVariable.NAME, "Iris").build()
    let tq = tp.using(input)

    expect(tq.type).toEqual(0)
    expect(tq.given).toEqual("Hello Iris")
    expect(tq.answer).toEqual("გამარჯობა Iris")
})

it('Can make a translation question with multiple constant inputs', () => {
    let tp = TranslationProduction(
        (name1, name2) => "Hello " + name1 + ", I'm called " + name2,
        (name1, name2) => "გამარჯობა " + name1 + ", მე მქვია " + name2,
        [ProductionVariable.NAME(1), ProductionVariable.NAME(2)])
    let input = ObjectBuilder()
        .put(ProductionVariable.NAME(1), "Iris")
        .put(ProductionVariable.NAME(2), "Andris")
        .build()
    let tq = tp.using(input)

    expect(tq.type).toEqual(0)
    expect(tq.given).toEqual("Hello Iris, I'm called Andris")
    expect(tq.answer).toEqual("გამარჯობა Iris, მე მქვია Andris")
})

it('Can make a translation question with multiple non-constant inputs', () => {
    let tp = TranslationProduction(
        (article, adj, noun) => "That is "  + article.english + " " + adj.english + " " + noun.english,
        (article, adj, noun) => "Das ist " + article.german + " " + adj.german + " " + noun.german,
        [ProductionVariable.ARTICLE, ProductionVariable.ADJECTIVE, ProductionVariable.NOUN])
    let input = ObjectBuilder()
        .put(ProductionVariable.ARTICLE, {english: "a", german: "ein"})
        .put(ProductionVariable.ADJECTIVE, {english: "good", german: "gute"})
        .put(ProductionVariable.NOUN, {english: "key", german: "Schlüssel"})
        .build()
    let tq = tp.using(input)

    expect(tq.type).toEqual(0)
    expect(tq.given).toEqual("That is a good key")
    expect(tq.answer).toEqual("Das ist ein gute Schlüssel")
})