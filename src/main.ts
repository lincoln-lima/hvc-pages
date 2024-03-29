import { HVC } from "hvcjs"

const hvc = new HVC()

hvc.addEventOutput((out:string) => {

    console.log(out);

})

hvc.setCode("740 840 000 20")

hvc.run()
