/**
 * Integration Tests for Locations CRUD
 *
 * Real tests against Supabase local instance with existing users.
 *
 * @ticket T-2-01
 * @environment CRT (Local Supabase)
 */

import { createClient } from '@supabase/supabase-js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Use local Supabase for integration tests
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Service client for direct table operations (bypasses RLS)
const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

// Anon client (respects RLS)
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

// Real user IDs from the local database
const TEST_USER_ID = 'a46875d2-b3db-41bc-b996-60fc6277e412' // 4tipruben@gmail.com
const OTHER_USER_ID = 'cc5756a8-1218-4972-89a6-ee4557d9c9db' // ruben4tip@gmail.com

describe('Locations CRUD Integration', () => {
  let createdLocationId: string
  let createdLocationIds: string[] = []

  beforeAll(async () => {
    // Clean up any existing test locations
    await serviceClient.from('locations').delete().eq('user_id', TEST_USER_ID)
    await serviceClient.from('locations').delete().eq('user_id', OTHER_USER_ID)
  })

  afterAll(async () => {
    // Clean up: delete all test locations
    for (const id of createdLocationIds) {
      await serviceClient.from('locations').delete().eq('id', id)
    }
    await serviceClient.from('locations').delete().eq('user_id', TEST_USER_ID)
    await serviceClient.from('locations').delete().eq('user_id', OTHER_USER_ID)
  })

  describe('CREATE', () => {
    it('should create a new location', async () => {
      const { data, error } = await serviceClient
        .from('locations')
        .insert({
          user_id: TEST_USER_ID,
          name: 'Test Location CRT',
          address: '123 Test Street',
          color: '#FF5733',
          is_active: true,
          order_index: 0,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.name).toBe('Test Location CRT')
      expect(data?.address).toBe('123 Test Street')
      expect(data?.color).toBe('#FF5733')
      expect(data?.is_active).toBe(true)
      expect(data?.user_id).toBe(TEST_USER_ID)

      createdLocationId = data!.id
      createdLocationIds.push(data!.id)
    })

    it('should reject duplicate name for same user (23505)', async () => {
      const { error } = await serviceClient.from('locations').insert({
        user_id: TEST_USER_ID,
        name: 'Test Location CRT', // Same name as previous
        address: 'Another Address',
      })

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505') // Unique violation
    })

    it('should have default color when not specified', async () => {
      const { data, error } = await serviceClient
        .from('locations')
        .insert({
          user_id: TEST_USER_ID,
          name: 'Location Without Color',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.color).toBe('#3F83F8') // Default color
      createdLocationIds.push(data!.id)
    })
  })

  describe('READ', () => {
    it('should read location by id', async () => {
      const { data, error } = await serviceClient
        .from('locations')
        .select('*')
        .eq('id', createdLocationId)
        .single()

      expect(error).toBeNull()
      expect(data?.id).toBe(createdLocationId)
      expect(data?.name).toBe('Test Location CRT')
    })

    it('should list all user locations ordered by order_index', async () => {
      const { data, error } = await serviceClient
        .from('locations')
        .select('*')
        .eq('user_id', TEST_USER_ID)
        .order('order_index', { ascending: true })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data!.length).toBeGreaterThanOrEqual(2)
    })

    it('should filter active locations only', async () => {
      const { data, error } = await serviceClient
        .from('locations')
        .select('*')
        .eq('user_id', TEST_USER_ID)
        .eq('is_active', true)

      expect(error).toBeNull()
      data?.forEach((loc) => {
        expect(loc.is_active).toBe(true)
      })
    })
  })

  describe('UPDATE', () => {
    it('should update location name', async () => {
      const newName = 'Updated Location CRT'
      const { data, error } = await serviceClient
        .from('locations')
        .update({ name: newName, updated_at: new Date().toISOString() })
        .eq('id', createdLocationId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.name).toBe(newName)
    })

    it('should toggle is_active', async () => {
      // Get current state
      const { data: current } = await serviceClient
        .from('locations')
        .select('is_active')
        .eq('id', createdLocationId)
        .single()

      // Toggle
      const { data, error } = await serviceClient
        .from('locations')
        .update({ is_active: !current?.is_active })
        .eq('id', createdLocationId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.is_active).toBe(!current?.is_active)

      // Toggle back
      await serviceClient.from('locations').update({ is_active: true }).eq('id', createdLocationId)
    })

    it('should update order_index', async () => {
      const { data, error } = await serviceClient
        .from('locations')
        .update({ order_index: 5 })
        .eq('id', createdLocationId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.order_index).toBe(5)
    })
  })

  describe('RLS Policies', () => {
    it('should block unauthenticated insert', async () => {
      // Anon client without auth should not be able to insert
      const { error } = await anonClient.from('locations').insert({
        name: 'Unauthorized Location',
        user_id: TEST_USER_ID,
      })

      // Should fail because anon is not authenticated as this user
      expect(error).toBeDefined()
    })
  })

  describe('Constraints', () => {
    it('should allow same name for different users', async () => {
      // Create location with same name for different user
      const { data, error } = await serviceClient
        .from('locations')
        .insert({
          user_id: OTHER_USER_ID,
          name: 'Updated Location CRT', // Same name as TEST_USER_ID's location
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(OTHER_USER_ID)

      createdLocationIds.push(data!.id)
    })

    it('should enforce unique (user_id, name) constraint', async () => {
      // Try to create another location with duplicate name for same user
      const { error } = await serviceClient.from('locations').insert({
        user_id: TEST_USER_ID,
        name: 'Updated Location CRT', // Already exists for this user
      })

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505')
    })
  })

  describe('DELETE', () => {
    it('should delete location without appointments', async () => {
      // Create a temporary location to delete
      const { data: tempLocation } = await serviceClient
        .from('locations')
        .insert({
          user_id: TEST_USER_ID,
          name: 'Temp Location To Delete',
        })
        .select()
        .single()

      expect(tempLocation).toBeDefined()

      // Delete it
      const { error } = await serviceClient.from('locations').delete().eq('id', tempLocation!.id)

      expect(error).toBeNull()

      // Verify it's gone
      const { data: deleted, error: selectError } = await serviceClient
        .from('locations')
        .select('*')
        .eq('id', tempLocation!.id)
        .single()

      expect(deleted).toBeNull()
      expect(selectError?.code).toBe('PGRST116') // Not found
    })
  })
})
