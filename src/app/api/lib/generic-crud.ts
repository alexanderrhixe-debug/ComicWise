import { NextResponse } from "next/server"

type GetFn = (id: any) => Promise<any>
type UpdateFn = (id: any, data: any) => Promise<any>
type DeleteFn = (id: any) => Promise<any>

export function zodToValidationResult(_schema: any) {
  // Return a simple validator function that always accepts (stub)
  return (value: any) => ({ success: true, value })
}

export async function getGenericEntity(
  id: any,
  opts: { getFn: GetFn; validateFn?: any; entityName?: string }
) {
  try {
    const data = await opts.getFn(id)
    if (!data)
      return NextResponse.json(
        { error: `${opts.entityName || "entity"} not found` },
        { status: 404 }
      )
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function updateGenericEntity(
  id: any,
  body: any,
  opts: { updateFn: UpdateFn; idValidateFn?: any; dataValidateFn?: any; entityName?: string }
) {
  try {
    // naive validation stubs
    if (opts.idValidateFn) {
      const r = opts.idValidateFn(id)
      if (r && r.success === false)
        return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }
    if (opts.dataValidateFn) {
      const r = opts.dataValidateFn(body)
      if (r && r.success === false)
        return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    const result = await opts.updateFn(id, body)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function deleteGenericEntity(
  id: any,
  opts: { deleteFn: DeleteFn; validateFn?: any; entityName?: string }
) {
  try {
    if (opts.validateFn) {
      const r = opts.validateFn(id)
      if (r && r.success === false)
        return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }
    const result = await opts.deleteFn(id)
    return NextResponse.json({ success: !!result })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
