import api from 'yarn-links'
import expect from 'expect'

export default async () => expect(await api()).toEqual([])
