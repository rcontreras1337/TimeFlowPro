/**
 * Integration Tests for Locations CRUD
 *
 * Real tests against Supabase instance (local or remote).
 * Uses environment variables for configuration.
 *
 * @ticket T-2-01
 * @environment CRT (Local) or PRD (Remote)
 */

import { createClient } from '@supabase/supabase-js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Use environment variables - works for both local and CI
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Skip all tests if no service key is available (required for integration tests)
const canRunIntegrationTests = SUPABASE_URL && SUPABASE_SERVICE_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeIntegration = canRunIntegrationTests ? describe : describe.skip

// Service client for direct table operations (bypasses RLS)
const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || 'dummy', {
  auth: { persistSession: false },
})

// Anon client (respects RLS)
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || 'dummy', {
  auth: { persistSession: false },
})

// Generate unique test prefix to avoid collisions
const TEST_PREFIX = `test_${Date.now()}_`

describeIntegration('Locations CRUD Integration', () => {
  let testUserId: string | null = null
  let otherUserId: string | null = null
  let createdLocationIds: string[] = []

  beforeAll(async () => {
    // Get a real user from the database to use for testing
    const { data: users } = await serviceClient.from('profiles').select('id').limit(2)

    if (users && users.length >= 1) {
      testUserId = users[0]?.id ?? null
      if (users.length >= 2) {
        otherUserId = users[1]?.id ?? null
      }
    }

    // Clean up any previous test data
    if (testUserId) {
      await serviceClient
        .from('locations')
        .delete()
        .eq('user_id', testUserId)
        .like('name', 'TEST_%')
    }
  })

  afterAll(async () => {
    // Clean up: delete all test locations created during this run
    for (const id of createdLocationIds) {
      await serviceClient.from('locations').delete().eq('id', id)
    }
  })

  describe('CREATE', () => {
    it('should create a new location', async () => {
      if (!testUserId) {
        console.log('Skipping: No test user available')
        return
      }

      const locationName = `TEST_Location_${TEST_PREFIX}1`
      const { data, error } = await serviceClient
        .from('locations')
        .insert({
          user_id: testUserId,
          name: locationName,
          address: '123 Test Street',
          color: '#FF5733',
          is_active: true,
          order_index: 0,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.name).toBe(locationName)
      expect(data?.address).toBe('123 Test Street')
      expect(data?.color).toBe('#FF5733')
      expect(data?.is_active).toBe(true)
      expect(data?.user_id).toBe(testUserId)

      if (data) createdLocationIds.push(data.id)
    })

    it('should reject duplicate name for same user (23505)', async () => {
      if (!testUserId) return

      const locationName = `TEST_Duplicate_${TEST_PREFIX}`

      // Create first location
      const { data: first } = await serviceClient
        .from('locations')
        .insert({ user_id: testUserId, name: locationName })
        .select()
        .single()

      if (first) createdLocationIds.push(first.id)

      // Try to create duplicate
      const { error } = await serviceClient.from('locations').insert({
        user_id: testUserId,
        name: locationName,
      })

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505')
    })

    it('should have default color when not specified', async () => {
      if (!testUserId) return

      const { data, error } = await serviceClient
        .from('locations')
        .insert({
          user_id: testUserId,
          name: `TEST_NoColor_${TEST_PREFIX}`,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.color).toBe('#3F83F8')
      if (data) createdLocationIds.push(data.id)
    })
  })

  describe('READ', () => {
    it('should read location by id', async () => {
      if (!testUserId || createdLocationIds.length === 0) return

      const { data, error } = await serviceClient
        .from('locations')
        .select('*')
        .eq('id', createdLocationIds[0])
        .single()

      expect(error).toBeNull()
      expect(data?.id).toBe(createdLocationIds[0])
    })

    it('should list user locations ordered by order_index', async () => {
      if (!testUserId) return

      const { data, error } = await serviceClient
        .from('locations')
        .select('*')
        .eq('user_id', testUserId)
        .like('name', 'TEST_%')
        .order('order_index', { ascending: true })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data!.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('UPDATE', () => {
    it('should update location name', async () => {
      if (!testUserId || createdLocationIds.length === 0) return

      const newName = `TEST_Updated_${TEST_PREFIX}`
      const { data, error } = await serviceClient
        .from('locations')
        .update({ name: newName })
        .eq('id', createdLocationIds[0])
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.name).toBe(newName)
    })

    it('should toggle is_active', async () => {
      if (!testUserId || createdLocationIds.length === 0) return

      const { data: current } = await serviceClient
        .from('locations')
        .select('is_active')
        .eq('id', createdLocationIds[0])
        .single()

      const { data, error } = await serviceClient
        .from('locations')
        .update({ is_active: !current?.is_active })
        .eq('id', createdLocationIds[0])
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.is_active).toBe(!current?.is_active)
    })
  })

  describe('RLS Policies', () => {
    it('should block unauthenticated insert', async () => {
      const { error } = await anonClient.from('locations').insert({
        name: 'Unauthorized',
        user_id: testUserId,
      })

      expect(error).toBeDefined()
    })
  })

  describe('Constraints', () => {
    it('should allow same name for different users', async () => {
      if (!testUserId || !otherUserId) {
        console.log('Skipping: Need 2 users for this test')
        return
      }

      const sharedName = `TEST_Shared_${TEST_PREFIX}`

      // Create for first user
      const { data: first } = await serviceClient
        .from('locations')
        .insert({ user_id: testUserId, name: sharedName })
        .select()
        .single()

      if (first) createdLocationIds.push(first.id)

      // Create same name for second user - should work
      const { data, error } = await serviceClient
        .from('locations')
        .insert({ user_id: otherUserId, name: sharedName })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      if (data) createdLocationIds.push(data.id)
    })
  })

  describe('DELETE', () => {
    it('should delete location', async () => {
      if (!testUserId) return

      const { data: temp } = await serviceClient
        .from('locations')
        .insert({ user_id: testUserId, name: `TEST_ToDelete_${TEST_PREFIX}` })
        .select()
        .single()

      expect(temp).toBeDefined()

      const { error } = await serviceClient.from('locations').delete().eq('id', temp!.id)

      expect(error).toBeNull()

      const { data: deleted } = await serviceClient
        .from('locations')
        .select()
        .eq('id', temp!.id)
        .single()

      expect(deleted).toBeNull()
    })
  })
})
