import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Edit, Shield, DollarSign, Users, Settings, BarChart3, AlertCircle } from 'lucide-react'
import { supabaseWithRetry } from '@/lib/supabaseWithRetry'
import { supabase } from '@/lib/supabase'

export default function AdminPanel({ onLoginClick }) {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [authCheckLoading, setAuthCheckLoading] = useState(true)
  const [currencies, setCurrencies] = useState([])
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    flag_emoji: '',
    exchange_rate: 1.0,
    is_active: true,
    display_order: 0
  })
  const [editingTutor, setEditingTutor] = useState(null)
  const [newTutor, setNewTutor] = useState({
    full_name: '',
    profile_photo_url: '',
    languages_taught: [],
    native_languages: [],
    hourly_rate_usd: 0,
    rating: 0,
    total_reviews: 0,
    total_lessons_taught: 0,
    experience_years: 0,
    bio: '',
    is_online: false,
    certifications: [],
    education: ''
  })

  // Check authorization on component mount
  useEffect(() => {
    const checkAuthorization = async () => {
      setAuthCheckLoading(true)
      
      if (!user) {
        // Don't redirect, just show login form
        setIsAuthorized(false)
        setAuthCheckLoading(false)
        return
      }

      try {
        const { data: profile, error } = await supabaseWithRetry.query(
          () => supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        )

        if (error) {
          console.error('Error fetching user role:', error)
          setIsAuthorized(false)
          setAuthCheckLoading(false)
          return
        }

        if (profile.role !== 'admin') {
          setIsAuthorized(false)
          setAuthCheckLoading(false)
          return
        }

        setUserRole(profile.role)
        setIsAuthorized(true)
        setAuthCheckLoading(false)
      } catch (error) {
        console.error('Authorization error:', error)
        setIsAuthorized(false)
        setAuthCheckLoading(false)
      }
    }

    if (!authLoading) {
      checkAuthorization()
    }
  }, [user, authLoading])

  // Load currencies
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const { data, error } = await supabase
          .from('currencies')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error loading currencies:', error)
          return
        }

        setCurrencies(data || [])
      } catch (error) {
        console.error('Error loading currencies:', error)
      }
    }

    if (isAuthorized) {
      loadCurrencies()
    }
  }, [isAuthorized])

  const handleAddTutor = () => {
    console.log('Adding new tutor:', newTutor)
    // Here you would typically save to your backend
    setNewTutor({
      full_name: '',
      profile_photo_url: '',
      languages_taught: [],
      native_languages: [],
      hourly_rate_usd: 0,
      rating: 0,
      total_reviews: 0,
      total_lessons_taught: 0,
      experience_years: 0,
      bio: '',
      is_online: false,
      certifications: [],
      education: ''
    })
  }

  const handleAddCurrency = async () => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .insert([newCurrency])
        .select()

      if (error) {
        console.error('Error adding currency:', error)
        alert('Error adding currency: ' + error.message)
        return
      }

      setCurrencies([...currencies, data[0]])
      setNewCurrency({
        code: '',
        name: '',
        symbol: '',
        flag_emoji: '',
        exchange_rate: 1.0,
        is_active: true,
        display_order: 0
      })
      alert('Currency added successfully!')
    } catch (error) {
      console.error('Error adding currency:', error)
      alert('Error adding currency')
    }
  }

  const handleUpdateCurrency = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('currencies')
        .update(updates)
        .eq('id', id)

      if (error) {
        console.error('Error updating currency:', error)
        alert('Error updating currency: ' + error.message)
        return
      }

      // Update local state
      setCurrencies(currencies.map(currency => 
        currency.id === id ? { ...currency, ...updates } : currency
      ))
      alert('Currency updated successfully!')
    } catch (error) {
      console.error('Error updating currency:', error)
      alert('Error updating currency')
    }
  }

  const handleDeleteCurrency = async (id) => {
    if (!confirm('Are you sure you want to delete this currency?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting currency:', error)
        alert('Error deleting currency: ' + error.message)
        return
      }

      setCurrencies(currencies.filter(currency => currency.id !== id))
      alert('Currency deleted successfully!')
    } catch (error) {
      console.error('Error deleting currency:', error)
      alert('Error deleting currency')
    }
  }

  const handleEditTutor = (tutor) => {
    setEditingTutor(tutor)
  }

  const handleDeleteTutor = (tutorId) => {
    console.log('Deleting tutor:', tutorId)
    // Here you would typically delete from your backend
  }

  // Show loading while checking authorization
  if (authLoading || authCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authorization...</p>
        </div>
      </div>
    )
  }

  // Show admin login gate if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-yellow-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Admin Access Required</CardTitle>
                          <p className="text-blue-200 mt-2">
                            {user ? 'You need admin role to access this panel.' : 'Please log in to access the admin panel.'}
                          </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Access Denied</h3>
                  <p className="text-red-200 mb-4">Your account doesn't have admin privileges.</p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Back to Home
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Login Required</h3>
                    <p className="text-blue-200">Please log in with your admin account to continue.</p>
                  </div>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => {
                        console.log('AdminPanel: Login button clicked, onLoginClick:', onLoginClick)
                        if (onLoginClick) {
                          onLoginClick()
                        } else {
                          console.error('onLoginClick prop is not defined!')
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Go to Login
                    </Button>
                    <Button 
                      onClick={() => navigate('/')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Back to Home
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Admin Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-blue-200">SITE_ADMIN Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.email}</p>
                <p className="text-blue-200 text-sm">Role: {userRole}</p>
              </div>
              <Button 
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tutors" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Tutors
            </TabsTrigger>
            <TabsTrigger value="currencies" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Currencies
            </TabsTrigger>
            <TabsTrigger value="languages" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Languages
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200"
                onClick={() => setActiveTab('tutors')}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Total Tutors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">12</div>
                  <p className="text-blue-200 text-sm">Active tutors</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200"
                onClick={() => setActiveTab('currencies')}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                    Currencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{currencies.length}</div>
                  <p className="text-blue-200 text-sm">Supported currencies</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200"
                onClick={() => setActiveTab('languages')}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-400" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">8</div>
                  <p className="text-blue-200 text-sm">Supported languages</p>
                </CardContent>
              </Card>

            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setActiveTab('currencies')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Currencies
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('tutors')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Tutors
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Currencies Management */}
          <TabsContent value="currencies" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Add New Currency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currency-code" className="text-white">Currency Code</Label>
                    <Input
                      id="currency-code"
                      value={newCurrency.code}
                      onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                      placeholder="INR"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency-name" className="text-white">Currency Name</Label>
                    <Input
                      id="currency-name"
                      value={newCurrency.name}
                      onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                      placeholder="Indian Rupee"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency-symbol" className="text-white">Symbol</Label>
                    <Input
                      id="currency-symbol"
                      value={newCurrency.symbol}
                      onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                      placeholder="₹"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency-flag" className="text-white">Flag Emoji</Label>
                    <Input
                      id="currency-flag"
                      value={newCurrency.flag_emoji}
                      onChange={(e) => setNewCurrency({...newCurrency, flag_emoji: e.target.value})}
                      placeholder="🇮🇳"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency-rate" className="text-white">Exchange Rate</Label>
                    <Input
                      id="currency-rate"
                      type="number"
                      step="0.0001"
                      value={newCurrency.exchange_rate}
                      onChange={(e) => setNewCurrency({...newCurrency, exchange_rate: parseFloat(e.target.value)})}
                      placeholder="83.0000"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency-order" className="text-white">Display Order</Label>
                    <Input
                      id="currency-order"
                      type="number"
                      value={newCurrency.display_order}
                      onChange={(e) => setNewCurrency({...newCurrency, display_order: parseInt(e.target.value)})}
                      placeholder="4"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <Button 
                    onClick={handleAddCurrency}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Currency
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Current Currencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currencies.map((currency) => (
                    <div key={currency.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{currency.flag_emoji}</span>
                        <div>
                          <div className="text-white font-medium">{currency.name} ({currency.code})</div>
                          <div className="text-blue-200 text-sm">Symbol: {currency.symbol} | Rate: {currency.exchange_rate}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateCurrency(currency.id, { is_active: !currency.is_active })}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          {currency.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCurrency(currency.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutors Management */}
          <TabsContent value="tutors" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Manage Tutors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tutor-name" className="text-white">Full Name</Label>
                      <Input
                        id="tutor-name"
                        value={newTutor.full_name}
                        onChange={(e) => setNewTutor({...newTutor, full_name: e.target.value})}
                        placeholder="e.g., Sarah Johnson"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutor-photo" className="text-white">Profile Photo URL</Label>
                      <Input
                        id="tutor-photo"
                        value={newTutor.profile_photo_url}
                        onChange={(e) => setNewTutor({...newTutor, profile_photo_url: e.target.value})}
                        placeholder="/images/tutor-placeholder-1.jpg"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutor-rate" className="text-white">Hourly Rate (USD)</Label>
                      <Input
                        id="tutor-rate"
                        type="number"
                        value={newTutor.hourly_rate_usd}
                        onChange={(e) => setNewTutor({...newTutor, hourly_rate_usd: parseFloat(e.target.value)})}
                        placeholder="25"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutor-rating" className="text-white">Rating</Label>
                      <Input
                        id="tutor-rating"
                        type="number"
                        step="0.1"
                        value={newTutor.rating}
                        onChange={(e) => setNewTutor({...newTutor, rating: parseFloat(e.target.value)})}
                        placeholder="4.9"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutor-experience" className="text-white">Experience (Years)</Label>
                      <Input
                        id="tutor-experience"
                        type="number"
                        value={newTutor.experience_years}
                        onChange={(e) => setNewTutor({...newTutor, experience_years: parseInt(e.target.value)})}
                        placeholder="5"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutor-reviews" className="text-white">Total Reviews</Label>
                      <Input
                        id="tutor-reviews"
                        type="number"
                        value={newTutor.total_reviews}
                        onChange={(e) => setNewTutor({...newTutor, total_reviews: parseInt(e.target.value)})}
                        placeholder="127"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="tutor-bio" className="text-white">Bio</Label>
                      <Textarea
                        id="tutor-bio"
                        value={newTutor.bio}
                        onChange={(e) => setNewTutor({...newTutor, bio: e.target.value})}
                        placeholder="Tell us about your teaching experience..."
                        rows={3}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="tutor-languages" className="text-white">Languages Taught (comma-separated)</Label>
                      <Input
                        id="tutor-languages"
                        value={newTutor.languages_taught.join(', ')}
                        onChange={(e) => setNewTutor({...newTutor, languages_taught: e.target.value.split(',').map(l => l.trim())})}
                        placeholder="English, Spanish, French"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="tutor-native" className="text-white">Native Languages (comma-separated)</Label>
                      <Input
                        id="tutor-native"
                        value={newTutor.native_languages.join(', ')}
                        onChange={(e) => setNewTutor({...newTutor, native_languages: e.target.value.split(',').map(l => l.trim())})}
                        placeholder="English"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddTutor} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tutor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Languages Management */}
          <TabsContent value="languages" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Language Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">Language management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">System settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}